import * as React from 'react';
import { render, cleanup } from '@testing-library/react';
import { QueryParamProvider, QueryParamContext } from '../index';
import { makeMockLocation, makeMockHistory } from './helpers';

describe('QueryParamProvider', () => {
  afterEach((done) => {
    cleanup()
    done()
  });

  it('works with @reach/router style history', () => {
    const reachHistory = { navigate: jest.fn() };

    const tree = (
      <QueryParamProvider reachHistory={reachHistory}>
        <QueryParamContext.Consumer>
          {({ history }) => {
            history.replace(makeMockLocation({ foo: '123' }));
            history.push(makeMockLocation({ bar: 'zzz' }));
            return <div>consumed</div>;
          }}
        </QueryParamContext.Consumer>
      </QueryParamProvider>
    );

    render(tree);

    expect(reachHistory.navigate).toBeCalledTimes(2);
    expect(reachHistory.navigate.mock.calls[0][0]).toBe(
      'http://localhost/?foo=123'
    );
    expect(reachHistory.navigate.mock.calls[0][1].replace).toBe(true);
    expect(reachHistory.navigate.mock.calls[1][0]).toBe(
      'http://localhost/?bar=zzz'
    );
    expect(reachHistory.navigate.mock.calls[1][1].replace).toBe(false);
  });

  it('works with react-router style history', () => {
    const routeProps = { history: makeMockHistory() };

    const MockRoute = ({ children }: any) => children(routeProps);

    const tree = (
      <QueryParamProvider ReactRouterRoute={MockRoute}>
        <QueryParamContext.Consumer>
          {({ history }) => {
            history.replace(makeMockLocation({ foo: '123' }));
            history.push(makeMockLocation({ bar: 'zzz' }));
            return <div>consumed</div>;
          }}
        </QueryParamContext.Consumer>
      </QueryParamProvider>
    );

    render(tree);

    expect(routeProps.history.replace).toBeCalledTimes(1);
    expect(routeProps.history.replace.mock.calls[0][0].search).toBe('?foo=123');
    expect(routeProps.history.push).toBeCalledTimes(1);
    expect(routeProps.history.push.mock.calls[0][0].search).toBe('?bar=zzz');
  });

  it('works with window history', () => {
    let windowHistory: any;

    const tree = (
      <QueryParamProvider>
        <QueryParamContext.Consumer>
          {({ history }) => {
            windowHistory = history;
            history.replace(makeMockLocation({ foo: '123' }));
            history.push(makeMockLocation({ bar: 'zzz' }));
            return <div>consumed</div>;
          }}
        </QueryParamContext.Consumer>
      </QueryParamProvider>
    );

    render(tree);

    expect(windowHistory.replace).toBeDefined();
    expect(windowHistory.push).toBeDefined();
  });
});
