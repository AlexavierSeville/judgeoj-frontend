<template>
  <div id="questionSubmitView">
    <!--搜索-->
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="userId" label="用户id">
        <a-input
          v-model="searchParams.userId"
          placeholder="请输入用户id"
          style="min-width: 237px"
        />
      </a-form-item>
      <a-form-item field="questionId" label="题目 id">
        <a-input
          v-model="searchParams.questionId"
          placeholder="请输入题目编号"
          style="min-width: 237px"
        />
      </a-form-item>
      <a-form-item field="language" label="编程语言">
        <a-select
          v-model="searchParams.language"
          placeholder="请选择语言"
          style="min-width: 237px"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit" style="min-width: 170px"
          >搜索
        </a-button>
      </a-form-item>
    </a-form>
    <!--分割线-->
    <a-divider size="0" />

    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total: total,
      }"
      @page-change="onPageChange"
    >
      <template #judgeInfo="{ record }">
        {{ JSON.stringify(record.judgeInfo) }}
      </template>
      <template #createTime="{ record }">
        <!--创建时间-->
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionSubmitQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const total = ref(0);
const dataList = ref([]);
const router = useRouter();
// const tableRef = ref();

const searchParams = ref<QuestionSubmitQueryRequest>({
  current: 1,
  pageSize: 10,
  questionId: undefined,
  language: undefined,
  userId: undefined,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    {
      // 将 searchParams.value 中的键值对展开进一个新对象中，并添加额外字段（sortField, sortOrder）
      ...searchParams.value,
      sortField: "createTime",
      sortOrder: "desc",
    }
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
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

/**
 * 跳转到做题
 * @param question
 */
const toQuestionPage = (question: Question) => {
  // console.log(question);
  router.push({
    path: `/view/questions/${question.id}`,
  });
};

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

/**
 * 监听searchParams变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});

const doSubmit = () => {
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
  // 已经watchEffect 了，所以不需要再手动触发了
  // loadData();
};

const columns = [
  {
    title: "提交号",
    dataIndex: "id",
  },
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "判题信息",
    slotName: "judgeInfo",
  },
  {
    title: "判题状态",
    dataIndex: "status",
  },
  {
    title: "题目 id",
    dataIndex: "questionId",
  },
  {
    title: "提交者 id",
    dataIndex: "userId",
  },
  {
    title: "提交时间",
    dataIndex: "createTime",
  },
];

// 在 <script setup> 中顶层定义的变量，会自动暴露给模板
</script>

<style scoped>
#managequestionSubmitView {
  max-width: 1077px;
  margin: 0 auto;
}
</style>
