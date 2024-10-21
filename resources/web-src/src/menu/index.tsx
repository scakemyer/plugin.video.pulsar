import React, { useState } from 'react';
import { Menu, Image, Modal, Form, Label, Input, Button, Dropdown } from 'semantic-ui-react';
import { saveRefreshRate, getRefreshRate } from '../Services/settings';
import logo from '../static/logo.png';

const HeaderMenu = (): JSX.Element => {
  const [refreshRateInSeconds, setRefreshRate] = useState<number>(() => getRefreshRate() / 1000);

  const SaveSettings = (_event: unknown, _data: unknown) => {
    const refreshRate = refreshRateInSeconds < 1 ? 1 : refreshRateInSeconds;
    saveRefreshRate(refreshRate * 1000);
    window.location.reload();
  };

  const StartAll = () => {
    void fetch('/torrents/resume');
  };

  const PauseAll = () => {
    void fetch('/torrents/pause');
  };

  return (
    <Menu borderless style={{ border: 'none' }}>
      <Menu.Item header as="a" href="/web">
        <Image size="mini" src={logo} />
        Elementum
      </Menu.Item>
      <Dropdown item text="Torrents">
        <Dropdown.Menu>
          <Dropdown.Item icon="download" text="Start all" onClick={StartAll} />
          <Dropdown.Item icon="pause" text="Pause all" onClick={PauseAll} />
        </Dropdown.Menu>
      </Dropdown>
      <Modal trigger={<Menu.Item position="right">Settings</Menu.Item>} closeIcon>
        <Modal.Header content="Settings" />
        <Modal.Content>
          <Form>
            <Form.Group inline>
              <Form.Field>
                <label htmlFor="refresh-rate">Refresh rate:</label>
                <Input
                  type="number"
                  min="1"
                  labelPosition="right"
                  value={refreshRateInSeconds}
                  onChange={(_event, data) => setRefreshRate(Number(data.value))}
                >
                  <input id="refresh-rate" />
                  <Label>Seconds</Label>
                </Input>
              </Form.Field>
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={SaveSettings} positive>
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    </Menu>
  );
};

export default HeaderMenu;
