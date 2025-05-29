<template>
  <div id="manageQuestionView">
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
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="doUpdate(record)"> 修改</a-button>
          <a-button status="danger" @click="doDelete(record)"> 删除</a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { Question, QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute, useRouter } from "vue-router";

const show = ref(true);
const total = ref(0);
const dataList = ref([]);
const route = useRoute();
const router = useRouter();
// const tableRef = ref();

const searchParams = ref({
  current: 1,
  pageSize: 10,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionByPageUsingPost(
    searchParams.value
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

const doUpdate = (question: Question) => {
  // console.log(question);
  router.push({
    path: "/update/question",
    //params是动态路由的参数，应该用query声明url后的参数
    query: {
      id: question.id,
    },
  });
};
const doDelete = async (question: Question) => {
  // console.log(question);
  const res = await QuestionControllerService.deleteQuestionUsingPost({
    id: question.id,
  });
  if (res.code === 0) {
    message.success("删除成功");
    // to do 刷新页面
    loadData();
  } else {
    message.error("删除失败, " + res.message);
  }
};

const onPageChange = (page: number) => {
  searchParams.value = {
    // 展开原有参数
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

const columns = [
  {
    title: "id",
    dataIndex: "id",
    width: 60,
  },
  {
    title: "标题",
    dataIndex: "title",
    width: 120,
  },
  {
    title: "题目内容",
    dataIndex: "content",
    width: 200,
  },
  {
    title: "题目答案",
    dataIndex: "answer",
    width: 200,
  },
  {
    title: "标签",
    dataIndex: "tags",
    width: 120,
  },
  {
    title: "提交数",
    dataIndex: "submitNum",
    width: 80,
  },
  {
    title: "通过数",
    dataIndex: "acceptedNum",
    width: 80,
  },
  {
    title: "判题配置",
    dataIndex: "judgeConfig",
    width: 150,
  },
  {
    title: "判题用例",
    dataIndex: "judgeCase",
    width: 150,
  },
  {
    title: "用户id",
    dataIndex: "userId",
    width: 80,
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    width: 120,
  },
  {
    title: "操作",
    slotName: "optional",
    width: 100,
    fixed: "right",
  },
];

// 在 <script setup> 中顶层定义的变量，会自动暴露给模板
</script>

<style scoped>
#manageQuestionView {
}
</style>
