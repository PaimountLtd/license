import { useEffect, useLayoutEffect } from 'react';
import {
  getComponentName, useForceUpdate, useOnCreate, useOnDestroy,
} from './hooks';
import { useModuleInstance } from './useModuleInstance';
import {
  generateId,
  getInstanceMetadata,
  GetModuleConstructorArgs,
  GetModuleInstanceFor,
  TModuleLocatorType,
} from '../scope';
import { ExtendView } from '../store/StateView';
import { createModuleView, GetModuleStateView, Store } from '../store';
import { ComponentView, ReactStoreAdapter } from './react-store-adapter';

export function useComponentView<TModule, TResult = GetUseComponentViewResult<TModule>>
(module: TModule): TResult {
  const forceUpdate = useForceUpdate();

  const {
    componentId, reactStore, component, provider,
  } = useOnCreate(() => {

    const provider = getInstanceMetadata(module).provider;
    const reactStore = provider.scope.resolve(ReactStoreAdapter);
    const store = provider.scope.resolve(Store);
    const componentName = getComponentName();
    const componentId = `${componentName}__${generateId()}`;
    let moduleView = createModuleView(module);
    const parentModuleView = provider.getMetadata('parentModuleView');
    if (parentModuleView) {
      moduleView = moduleView.mergeView(parentModuleView);
    }
    const component = reactStore.registerComponent(moduleView, componentId, forceUpdate);

    function extend<TNewProps>(
      newPropsFactory: (props: GetModuleStateView<TModule>['props']) => TNewProps,
    ): (ExtendView<GetModuleStateView<TModule>['props'], TNewProps>)['props'] {
      const newProvider = provider.resolveChildProvider(() => newPropsFactory(moduleView.props as any), componentId);
      newProvider.setMetadata('parentModuleView', moduleView);// TODO remove metadata
      store.setModuleContext(componentId, provider.childScope!);
      const result = useModule(componentId) as any;
      store.resetModuleContext(componentId);
      return result;
    }

    moduleView.defineProp({
      description: 'extend',
      name: 'extend',
      getValue: () => extend,
    });

    moduleView.defineProp({
      description: 'ComponentView',
      name: 'componentView',
      getValue: () => component,
    });

    return {
      componentId, component, moduleView, reactStore, provider,
    };
  });

  useOnDestroy(() => {
    reactStore.destroyComponent(componentId);
  });

  useLayoutEffect(() => {

    const stateView = component.stateView;
    if (!stateView.hasSelectedProps) return;

    component.makeSnapshot();

    const watcherId = reactStore.createWatcher(component.id, () => {

      if (provider.isDestroyed) return;

      const shouldUpdate = component.shouldComponentUpdate();
      if (shouldUpdate) {
        component.setInvalidated(true);
      }
    });
    return () => {
      reactStore.removeWatcher(watcherId);
    };
  }, []);

  useEffect(() => {
    component.setMounted();
  }, []);

  return component.stateView.proxy as TResult;
}

export function useModule<T extends TModuleLocatorType, TInitState extends boolean | GetModuleConstructorArgs<T>>(locator: T, initProps: TInitState|null = null, moduleName = ''): GetUseComponentViewResult<GetModuleInstanceFor<T>> {
  const module = useModuleInstance(locator, initProps, moduleName);
  return useComponentView(module);
}

export type GetUseComponentViewResult<TModuleInstance> =
  GetModuleStateView<TModuleInstance>['props'] &
  {
    componentView: ComponentView,
    extend: <TNewProps>(newPropsFactory: (props: GetModuleStateView<TModuleInstance>['props']) => TNewProps) => ExtendView<GetModuleStateView<TModuleInstance>['props'], TNewProps>['props'] & {componentView: ComponentView }
  }

export type GetUseModuleResult<T> = GetUseComponentViewResult<GetModuleInstanceFor<T>>;
