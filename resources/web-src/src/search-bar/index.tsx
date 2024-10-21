import React, { FC, useReducer, useRef, useState } from 'react';
import { Dropdown, DropdownItemProps, Grid, Icon, Item, ItemGroup, Search, SearchResultProps, Statistic } from 'semantic-ui-react';
import { useDebouncedCallback } from 'use-debounce';

const debounceWaitTime = 500;

type TorrentType = 'Movies' | 'TvShows' | 'General';
const torrentTypes: DropdownItemProps[] = [
  {
    text: 'Movies',
    value: 'Movies',
    icon: 'film',
  },
  {
    text: 'TV Shows',
    value: 'TvShows',
    icon: 'tv',
  },
  {
    text: 'General',
    value: 'General',
    icon: 'magnet',
  },
];

type Action =
  | { type: 'CleanQuery' }
  | { type: 'StartSearch'; query: string }
  | { type: 'FinishSearch'; results: ResultView[] }
  | { type: 'UpdateSelection'; selection: string };

type MediaType = 'movie' | 'tvshow' | 'season' | 'episode';
interface Info {
  plotoutline: string;
  tagline: string;
  code: string;
  year: number;
  rating: number;
  genre: string[];
  date: Date;
  mediatype: MediaType;
}

interface Art {
  thumb: string;
}

interface Result {
  label: string;
  info: Info;
  art: Art;
  path: string;
  is_playable: boolean;
}

interface ResultView {
  title: string;
  tagline: string;
  description: string;
  year: number;
  rating: number;
  genre: string[];
  date: Date;
  image: string;
  path: string;
  mediatype: MediaType;
  key: string;
}

interface State {
  loading: boolean;
  results: ResultView[];
  value: string;
}

const initialState: State = {
  loading: false,
  results: [],
  value: '',
};

function queryReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'CleanQuery':
      return initialState;
    case 'StartSearch':
      return { ...state, loading: true, value: action.query };
    case 'FinishSearch':
      return { ...state, loading: false, results: action.results };
    case 'UpdateSelection':
      return { ...state, value: action.selection };
  }
}

const resultRenderer = (item: SearchResultProps) => {
  const result = item as ResultView;
  return (
    <ItemGroup>
      <Item>
        <Item.Image size="small" src={result.image} />
        <Item.Content>
          <Item.Header>{result.title}</Item.Header>
          <Item.Meta>{result.tagline}</Item.Meta>
          <Item.Description>{result.description}</Item.Description>
          {result.mediatype !== 'season' && (
            <Item.Extra>{`${result.rating} - ${result.genre?.join(', ')} - ${result.date?.toString() ?? result.year ?? '-'}`}</Item.Extra>
          )}
        </Item.Content>
      </Item>
    </ItemGroup>
  );
};

function getSearchType(torrentType: TorrentType): string {
  switch (torrentType) {
    case 'Movies':
      return 'movies';
    case 'TvShows':
      return 'shows';
    case 'General':
      return '.';
  }
}

async function querySearchResults(url: string, dispatch: React.Dispatch<Action>) {
  const response = await fetch(url);
  const items = (await response.json()).items as Result[];

  dispatch({
    type: 'FinishSearch',
    results: items
      .filter((i) => i.info !== undefined)
      .map((i) => ({
        image: i.art.thumb,
        key: `${i.info.code}-${i.label}`,
        description: i.info.plotoutline,
        title: i.label,
        tagline: i.info.tagline,
        year: i.info.year,
        date: i.info.date,
        genre: i.info.genre,
        rating: i.info.rating,
        mediatype: i.info.mediatype,
        path: i.path,
      })),
  });
}

interface IStatisticsProps {
  /**
   * Total download rate in kB/s
   */
  totalDownloadRate: number;

  /**
   * Total upload rate in kB/s
   */
  totalUploadRate: number;

  /**
   * Active torrents
   */
  active: number;

  /**
   * Finished torrents
   */
  finished: number;

  /**
   * Total torrents
   */
  total: number;
}

const Statistics: FC<IStatisticsProps> = ({ totalDownloadRate, totalUploadRate, active, finished, total }: IStatisticsProps) => {
  const [torrentType, setTorrentType] = useState<TorrentType>('Movies');
  const searcRef = useRef<any>();
  const [state, dispatch] = useReducer(queryReducer, initialState);
  const { loading, results, value } = state;

  const debounceSearchChange = useDebouncedCallback(async (query: string) => {
    const searchType = getSearchType(torrentType);

    await querySearchResults(`/${searchType}/search?q=${query}`, dispatch);
  }, debounceWaitTime);

  const handleQueryChange = async (query: string) => {
    dispatch({
      type: 'StartSearch',
      query,
    });

    if (query.trim().length === 0) {
      dispatch({
        type: 'CleanQuery',
      });
      return;
    }

    await debounceSearchChange(query);
  };

  const handleResultSelect = async (data: ResultView): Promise<void> => {
    const path = data.path.replace('plugin://plugin.video.elementum/', '');
    const url = `/${path}?external=1`;

    switch (torrentType) {
      case 'Movies':
        await fetch(url);
        break;
      case 'TvShows': {
        dispatch({
          type: 'StartSearch',
          query: value,
        });

        if (path.includes('links')) {
          await fetch(url);
        } else {
          await querySearchResults(url, dispatch);
          searcRef.current.open();
        }
        break;
      }
      case 'General':
        break;
    }
  };

  const handleTorrentTypeChange = (torrentTypeValue: TorrentType) => {
    setTorrentType(torrentTypeValue);
    dispatch({
      type: 'CleanQuery',
    });
  };

  return (
    <>
      <Grid stackable columns="3">
        <Grid.Row verticalAlign="middle">
          <Grid.Column floated="left">
            <Search
              fluid
              placeholder="Search"
              loading={loading}
              results={results}
              value={value}
              onSearchChange={(_, data) => handleQueryChange(data.value ?? '')}
              resultRenderer={resultRenderer}
              onResultSelect={(_, data) => handleResultSelect(data.result)}
              ref={searcRef}
              minCharacters={3}
              input={{
                icon: 'search',
                action: (
                  <Dropdown
                    fluid
                    selection
                    options={torrentTypes}
                    defaultValue={torrentTypes[0].value}
                    onChange={(_, data) => handleTorrentTypeChange(data.value as TorrentType)}
                  />
                ),
              }}
            />
          </Grid.Column>
          <Grid.Column width="3">
            <Statistic.Group widths="3" size="tiny">
              <Statistic>
                <Statistic.Value>{active}</Statistic.Value>
                <Statistic.Label>Active</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>{finished}</Statistic.Value>
                <Statistic.Label>Finished</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>{total}</Statistic.Value>
                <Statistic.Label>Total</Statistic.Label>
              </Statistic>
            </Statistic.Group>
          </Grid.Column>
          <Grid.Column floated="right">
            <Statistic.Group widths="2" size="tiny">
              <Statistic>
                <Statistic.Value>
                  <Icon name="arrow down" size="small" />
                  {` ${totalDownloadRate.toFixed(1)} kB/s`}
                </Statistic.Value>
              </Statistic>
              <Statistic>
                <Statistic.Value>
                  <Icon name="arrow up" size="small" />
                  {` ${totalUploadRate.toFixed(1)} kB/s`}
                </Statistic.Value>
              </Statistic>
            </Statistic.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};

export default Statistics;
