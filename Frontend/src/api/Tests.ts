import { ITest, ITestUpdate, IResponseId } from "@/shared/interfaces";
import { DEFAULT_EP } from "@/shared/utils/constants";
import axios from "axios";

const Tests = {
  getTests: async () =>
    axios.get<ITest[]>(`${DEFAULT_EP}/test`).then((response) => response.data),
  getActiveTests: async () =>
    axios
      .get<ITest[]>(`${DEFAULT_EP}/test/active`)
      .then((response) => response.data),
  getTest: async (testId: string) =>
    axios
      .get<ITest>(`${DEFAULT_EP}/test/${testId}`)
      .then((response) => response.data),
  postTest: async (test: ITestUpdate) =>
    axios
      .post<IResponseId>(`${DEFAULT_EP}/test`, test)
      .then((response) => response.data),
  postTestZipFile: async (test: ITestUpdate, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return axios
      .post<IResponseId>(
        `${DEFAULT_EP}/test/import?testName=${test.name}&courseId=${test.courseId}${test.schoolYear && "&schoolYear=" + test.schoolYear}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => response.data);
  },
  putTest: async (testId: string, test: ITestUpdate) =>
    axios
      .put(`${DEFAULT_EP}/test/${testId}`, test)
      .then((response) => response.data),
  deleteTest: async (testId: string) =>
    axios
      .delete(`${DEFAULT_EP}/test/${testId}`)
      .then((response) => response.data),
};

export default Tests;