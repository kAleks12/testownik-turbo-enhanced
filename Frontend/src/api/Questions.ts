import {
  IQuestionUpdate,
  IResponseId,
  IResponseUrl,
} from "@/shared/interfaces";
import { DEFAULT_EP } from "@/shared/utils/constants";
import axios from "axios";

const Questions = {
  postQuestion: async (question: IQuestionUpdate) =>
    axios
      .post<IResponseId>(`${DEFAULT_EP}/question`, question)
      .then((response) => response.data),
  putQuestion: async (questionId: string, question: IQuestionUpdate) =>
    axios
      .put<IResponseId>(`${DEFAULT_EP}/question/${questionId}`, question)
      .then((response) => response.data),
  deleteQuestion: async (questionId: string) =>
    axios
      .delete(`${DEFAULT_EP}/question/${questionId}`)
      .then((response) => response.data),
  postQuestionImage: async (questionId: string, image: File) => {
    const formData = new FormData();
    formData.append("file", image);

    return axios
      .post<IResponseUrl>(
        `${DEFAULT_EP}/question/${questionId}/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => response.data);
  },
  deleteQuestionImage: async (questionId: string) =>
    axios
      .delete(`${DEFAULT_EP}/question/${questionId}/image`)
      .then((response) => response.data),
};

export default Questions;
