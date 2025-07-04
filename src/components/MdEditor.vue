<template>
  <Editor
    :value="props.value"
    :plugins="plugins"
    :mode="mode"
    @change="props.handleChange"
  />
</template>

<script setup lang="ts">
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { Editor } from "@bytemd/vue-next";
import { ref, withDefaults, defineProps } from "vue";

const value = ref("");

// 定义了这个组件能接收什么参数
// 组件化开发的核心是【解耦】【复用】【通信】，而 props 正是通信的桥梁
// 父组件：负责管理数据、控制逻辑，比如页面上有什么内容。
// 子组件：负责展示、局部交互，比如一个编辑器、一个按钮、一个上传控件。
// 子组件一般不会自己维护数据，而是拿父组件给的数据来展示，然后把变化通知父组件。
// 这就形成了【父管控 ➡ 子展示 ➡ 子反馈 ➡ 父更新】的流动。
// 父HomeView ➡ 子MdEditor	通过 props 把数据传进去，比如 value
// 子 ➡ 父	通过事件或者函数，把用户的操作通知给父，比如 handleChange
interface Props {
  value: string;
  mode?: string;
  handleChange: (v: string) => void;
}

// defineProps是Vue3 <script setup> 的语法糖，声明这个组件有哪些 props
// withDefaults(defineProps(), {...}) 是在给这些 props 设置默认值，如果父组件没传，就用这里的默认值
const props = withDefaults(defineProps<Props>(), {
  value: "",
  mode: () => "split",
  handleChange: (v: string) => {
    console.log(v);
  },
});

const plugins = [
  gfm(),
  highlight(),
  // Add more plugins here
];

//当编辑器里的内容发生变化时，把变化后的内容更新到 value 这个响应式变量中
// const handleChange = (v: string) => {
//   value.value = v;
// };
</script>

<style>
.bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right:last-child {
  display: none;
}
</style>
