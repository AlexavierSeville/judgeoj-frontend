<template>
  <div
    id="code-editor"
    ref="codeEditorRef"
    style="min-height: 700px; height: 70vh"
  />
  <!--<a-button @click="fillValue">填充值</a-button>-->
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor";
import { onMounted, ref, toRaw, withDefaults, defineProps, watch } from "vue";

/**
 * 定义组件属性类型
 */
interface Props {
  value: string;
  language?: string;
  handleChange: (v: string) => void;
}

// defineProps是Vue3 <script setup> 的语法糖，声明这个组件有哪些 props
// withDefaults(defineProps(), {...}) 是在给这些 props 设置默认值，如果父组件没传，就用这里的默认值
// 为什么给 value 和 language 设置默认值时用的是函数 () => "" 而不是直接写成 ""？
// 这是 Vue 3 中 withDefaults() 的规范行为，特别是当 prop 是一个函数、对象或某些类型时，
// 推荐使用函数返回默认值，防止引用类型在多个组件实例之间共享。
const props = withDefaults(defineProps<Props>(), {
  value: () => "",
  language: () => "java",
  handleChange: (v: string) => {
    console.log(v);
  },
});

const codeEditorRef = ref();
const codeEditor = ref();

// const fillValue = () => {
//   if (!codeEditor.value) {
//     return;
//   }
//   toRaw(codeEditor.value).setValue("新的值");
// };

watch(
  // 监听 language 属性变化，注意这里要用箭头函数才能监听到变化
  () => props.language,
  () => {
    //用于代码编辑器的语言切换
    if (codeEditor.value) {
      monaco.editor.setModelLanguage(
        toRaw(codeEditor.value.getModel()),
        props.language
      );
    }
  }
);

onMounted(() => {
  if (!codeEditorRef.value) {
    return;
  }
  codeEditor.value = monaco.editor.create(codeEditorRef.value, {
    value: props.value,
    language: props.language,
    automaticLayout: true,
    colorDecorators: true,
    minimap: {
      enabled: true,
    },
    readOnly: false,
    theme: "vs-dark",
    // lineNumbers: "off",
    // roundedSelection: false,
    // scrollBeyondLastLine: false,
  });
  // 监听内容变化
  // 当调用如：codeEditor.value.setValue("新的值");
  // Vue 会试图“跟踪”这个 setValue() 的调用，以便在这个值变动时触发视图更新。
  // 但是：Monaco Editor 的实例非常复杂，内部有大量属性、监听器、事件循环和数据结构。
  // 如果你对它做响应式代理，会导致 Vue 深度递归监听它所有属性的变更，从而触发巨量依赖追踪和无限循环。
  // toRaw() 是 Vue 提供的 API，用于从响应式对象中提取原始对象，自己监听、自己处理
  // 这个原始实例，Vue 就不会试图“追踪”你对其的修改，从而避免性能灾难。
  codeEditor.value.onDidChangeModelContent(() => {
    // console.log("当前内容为：", toRaw(codeEditor.value).getValue());
    props.handleChange(toRaw(codeEditor.value).getValue());
  });
});
</script>

<style scoped></style>
