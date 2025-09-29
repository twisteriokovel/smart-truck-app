### Core Development Rules

1. When you work with the Pinia store, please use the following pattern to work with getters/state. Use destruction of methods and getters/state. Use `storeToRefs` when we need to keep the reactivity

```
import { storeToRefs } from 'pinia'
import { useExampleStore } from 'stores/example.ts'

const exampleStore = useExampleStore()
const { exampleGetter } = storeToRefs(exampleStore)
const { exampleMethod } = exampleStore
```

2. In Vue components and store each method should be in format like

```
function methodName(params: ITypeExample) {}
```

3. Each type or interface should start with `I`. Example `ITruckData`
4. You don't need to Type every function. If it has default and obvious typing like string or boolean or void, please ignore that
5. Use translation for each texts
6. When you work with PrimeVue components, you should import them
7. When you work with async data fetching make sure you call them on `onBeforeMount` hook but on `onMounted` hook
8. For form fields validation use `vue-tiny-validate` package, example of usage is `LoginForm.vue` component
