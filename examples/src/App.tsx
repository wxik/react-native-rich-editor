/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import {FC, useMemo, useState} from 'react';
import {Example} from './example';
import {Welcome} from './welcome';
import {Preview} from './preview';
import {INavigation} from './interface';

const Routes = {
  index: Welcome,
  rich: Example,
  preview: Preview,
};

type RouteKeyType = keyof typeof Routes;

const App: FC = () => {
  const [routeKey, setRouteKey] = useState<RouteKeyType>('index');
  const [args, setArgs] = useState<Record<string, any>>({});

  const handleFuc = useMemo<INavigation>(() => {
    return {
      push: (key: RouteKeyType, params: Record<string, any>) => {
        if (Routes[key]) {
          setRouteKey(key);
          setArgs(params);
        }
      },
    };
  }, []);
  const Comp = Routes[routeKey];
  return <Comp navigation={handleFuc} {...args} />;
};

export default App;
