<template>
  <div id="questionsView">
    <!--搜索-->
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="title" label="题目名称">
        <a-input
          v-model="searchParams.title"
          placeholder="请输入题目名称"
          style="min-width: 237px"
        />
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-input-tag
          v-model="searchParams.tags"
          placeholder="请输入标签"
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
      <template #tags="{ record }">
        <!--标签-->
        <a-space wrap>
          <a-tag v-for="(tag, index) of record.tags" :key="index" color="green"
            >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #acceptedRate="{ record }">
        <!--通过率-->
        {{
          `${
            record.submitNum ? (record.acceptedNum / record.submitNum) * 100 : 0
          }% (${record.acceptedNum} / ${record.submitNum})`
        }}
      </template>
      <template #createTime="{ record }">
        <!--创建时间-->
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>

      <template #optional="{ record }">
        <a-space>
          <a-button
            status="success"
            type="primary"
            @click="toQuestionPage(record)"
            >Go Go Go, 出发咯
          </a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute, useRouter } from "vue-router";
import moment from "moment";

const show = ref(true);
const total = ref(0);
const dataList = ref([]);
const route = useRoute();
const router = useRouter();
// const tableRef = ref();

const searchParams = ref<QuestionQueryRequest>({
  current: 1,
  pageSize: 10,
  title: "",
  tags: [],
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
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
    title: "题号",
    dataIndex: "id",
  },
  {
    title: "题目名称",
    dataIndex: "title",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
  {
    slotName: "optional",
  },
];

// 在 <script setup> 中顶层定义的变量，会自动暴露给模板
</script>

<style scoped>
#manageQuestionView {
  max-width: 1077px;
  margin: 0 auto;
}
</style>
