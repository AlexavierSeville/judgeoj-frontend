<template>
  <div id="viewQuestionView">
    <a-row :gutter="[27, 27]">
      <a-col :md="12" :xs="27">
        <a-tabs default-active-key="question">
          <a-tab-pane key="question" title="题目">
            <template>
              <icon-calendar />
            </template>
            <a-card v-if="question" :title="question.title">
              <a-descriptions
                title="判题信息"
                :column="{ xs: 1, md: 2, lg: 3 }"
              >
                <a-descriptions-item label="时间限制">
                  {{ question.judgeConfig.timeLimit ?? "竟然无限制？" }}
                </a-descriptions-item>
                <a-descriptions-item label="内存限制">
                  {{ question.judgeConfig.memoryLimit ?? "竟然无限制？" }}
                </a-descriptions-item>
                <a-descriptions-item label="堆栈限制">
                  {{ question.judgeConfig.stackLimit ?? "竟然无限制？" }}
                </a-descriptions-item>
              </a-descriptions>
              <MdViewer :value="question.content || '无内容！！！'" />
              <template #extra>
                <a-space wrap>
                  <a-tag
                    v-for="(tag, index) of question.tags"
                    :key="index"
                    color="green"
                    >{{ tag }}
                  </a-tag>
                </a-space>
              </template>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="comment" title="评论">
            <template>
              <icon-clock-circle />
            </template>
            还没实现呢
          </a-tab-pane>
          <a-tab-pane key="answer" title="题解">
            <template>
              <icon-user />
            </template>
            {{ (question && question.tags) || "竟然没有答案？？？" }}
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="27">
        <!--搜索-->
        <a-form :model="searchParams" layout="inline">
          <a-form-item field="title" label="编程语言">
            <a-select
              v-model="form.language"
              placeholder="请选择语言"
              style="min-width: 137px"
            >
              <a-option>java</a-option>
              <a-option>cpp</a-option>
              <a-option>go</a-option>
              <a-option>html</a-option>
            </a-select>
          </a-form-item>
        </a-form>
        <CodeEditor
          :value="form.code as string"
          :language="form.language"
          :handleChange="changeCode"
        />
        <a-divider size="0" />
        <a-button type="primary" style="min-width: 200px" @click="doSubmit"
          >提交代码
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, withDefaults, defineProps } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  // QuestionSubmitControllerService,
  QuestionVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";

const question = ref<QuestionVO>();

// const tableRef = ref();

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    message.error("获取失败, " + res.message);
  }
};

onMounted(() => {
  /**
   * 页面加载时请求数据
   */
  loadData();
});

const form = ref<QuestionSubmitAddRequest>({
  language: "java",
  code: "",
});

const changeCode = (value: string) => {
  form.value.code = value;
};

const doSubmit = async () => {
  if (!question.value?.id) {
    return;
  }
  const res = await QuestionControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value.id,
  });
  if (res.code === 0) {
    message.success("提交成功");
  } else {
    message.error("提交失败, " + res.message);
  }
};
</script>

<style scoped>
#viewQuestionView {
  max-width: 1477px;
  margin: 0 auto;
}

#viewQuestionView .arco-card-header-extra .arco-space-item {
  margin-bottom: 0 !important;
}
</style>
