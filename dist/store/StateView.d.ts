import { Dict, Scope, TModuleInstanceFor } from '../scope';
import { GetStateViewProps } from './plugins/pickStateViews';
import { GetLoadingState } from './plugins/pickLoadingState';
import { GetModuleState } from './plugins/pickState';
import { GetControllerProps } from './plugins/pickControllers';
export declare class StateView<TProps = {}> {
    scope?: Scope | undefined;
    props: TProps;
    proxy: TProps;
    descriptors: TGetDescriptorsForProps<TProps>;
    selectedDescriptors: TGetDescriptorsForProps<TProps>;
    hasReactiveProps: boolean;
    hasSelectedProps: boolean;
    hasWildcardProps: boolean;
    wildcardPropCreator: ((propName: string) => unknown) | null;
    constructor(scope?: Scope | undefined);
    defineProp<TValue>(descriptorParams: TConstructDescriptorProps<TValue>): void;
    defineWildcardProp(cb: StateView['wildcardPropCreator']): void;
    private selectValue;
    getSnapshot(): TProps;
    get selectedProps(): TProps;
    getAnalytics(): void;
    /**
     * // Extend with a factory returning a new ModuleView
     *
     * module.extend((props, view) => {
     *   const module = scope.resolve(MyModule)
     *   return new ModuleView(module)
     * })
     */
    extend<TNewView extends StateView<any>>(newViewFactory: (props: TProps, view: StateView<TProps>) => TNewView): TNewView;
    extend<TNewProps>(newProps: TNewProps): MergeViews<StateView<TProps>, TStateViewFor<TNewProps>>;
    clone(): StateView<TProps>;
    mergeView<TExtension extends StateView<any>, TResult = MergeViews<StateView<TProps>, TExtension>>(extension: TExtension): TResult;
    components: Dict<ComponentView<any>>;
    registerComponent<TView extends StateView<TProps>>(componentId: string, forceUpdate: Function): ComponentView<TView>;
    destroyComponent(componentId: string): void;
}
export declare function createStateViewForModule<T>(module: T): import("./plugins/pickControllers").PickControllers<StateView<T & GetStateViewProps<T> & {
    loadingStatus: import("../scope").TLoadingStatus;
} & import("./Store").ModuleStateController & import("./Store").PickGeneratedMutations<{
    loadingStatus: import("../scope").TLoadingStatus;
}> & Omit<import("./plugins/pickLoadingState").LoadingState, never> & GetModuleState<T>>, T>;
export declare type TStateViewFor<TModuleConfig, TModule = TModuleInstanceFor<TModuleConfig>> = StateView<TModule & GetStateViewProps<TModule> & GetLoadingState & GetModuleState<TModule> & GetControllerProps<TModule>>;
export declare type MergeViews<TView1 extends StateView<any>, TView2 extends StateView<any>> = StateView<GetProps<TView1> & GetProps<TView2>>;
export declare class ComponentView<TStateView extends StateView<any>> {
    stateView: TStateView;
    id: string;
    forceUpdate: Function;
    constructor(stateView: TStateView, id: string, forceUpdate: Function);
}
export declare type TModulePropDescriptor<TValue> = {
    type: string;
    name: string;
    reactive: boolean;
    stateView: StateView | null;
    getValue(): TValue;
    getRev(): unknown;
    enumerable: boolean;
    configurable: boolean;
    dynamic: boolean;
};
export declare type TConstructDescriptorProps<TValue, TDescriptor = TModulePropDescriptor<TValue>> = Partial<TDescriptor> & Required<Pick<TModulePropDescriptor<TValue>, 'type' | 'name' | 'getValue'>>;
export declare type TGetDescriptorsForProps<TProps extends Dict<any>> = {
    [P in keyof TProps]: TModulePropDescriptor<TProps[P]>;
};
export declare type GetProps<TModuleView> = TModuleView extends StateView<infer TProps> ? TProps : never;
