import { IRemoteClientParams, ISender } from './RemoteStoreClient';

export const PostMessageTransport: IRemoteClientParams = {
  connect(onMessage: any): Promise<ISender> {
    const opener = window.opener;

    if (!opener) throw new Error('Window.opener is not defined');

    const sender = {
      write(msg: string) {
        opener.postMessage(msg);
        return Promise.resolve();
      },
    };

    window.addEventListener('message', (event: any) => {
      const msg = event.data;
      onMessage(msg, sender);
    }, false);

    return Promise.resolve(sender);
  },
};