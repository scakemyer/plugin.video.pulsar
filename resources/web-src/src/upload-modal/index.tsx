import React from 'react';
import { Button, Form, Icon, Modal } from 'semantic-ui-react';

function UploadTorrentModal(): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [uri, setUri] = React.useState('');
  const [file, setFile] = React.useState<File>();

  async function addTorrent(path: string, additionalData?: [name: string, value: string][]) {
    const formData = new FormData();
    formData.append('uri', uri);
    formData.append('file', file ?? 'null');
    additionalData?.forEach((x) => formData.append(x[0], x[1]));

    await fetch(path, {
      method: 'POST',
      body: formData,
    });
    setOpen(false);
  }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button icon labelPosition="left" floated="right" primary>
          <Icon name="download" />
          Add Torrent
        </Button>
      }
    >
      <Modal.Header>Add Torrent</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Form>
            <Form.Input placeholder="Magnet or Torrent file URL" onChange={(e) => setUri(e.target.value)} />
            <Form.Input type="file" accept=".torrent" onChange={(e) => setFile(e.target.files?.item(0) ?? undefined)} />
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button content="Cancel" color="red" onClick={() => setOpen(false)} />
        <Button
          content="Add (all files)"
          labelPosition="left"
          icon="download"
          color="yellow"
          onClick={() => addTorrent('/torrents/add', [['all', '1']])}
        />
        <Button content="Add" labelPosition="left" icon="download" color="blue" onClick={() => addTorrent('/torrents/add')} />
        <Button content="Stream" labelPosition="left" icon="play" color="green" onClick={() => addTorrent('/playuri')} />
      </Modal.Actions>
    </Modal>
  );
}

export default UploadTorrentModal;
