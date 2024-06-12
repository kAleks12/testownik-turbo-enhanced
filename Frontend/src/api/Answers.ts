import { IAnswerUpdate, IResponseId, IResponseUrl } from "@/shared/interfaces";
import { DEFAULT_EP } from "@/shared/utils/constants";
import axios from "axios";

const Answers = {
  postAnswer: async (answer: IAnswerUpdate) =>
    axios
      .post<IResponseId>(`${DEFAULT_EP}/answer`, answer)
      .then((response) => response.data),
  putAnswer: async (answerId: string, answer: IAnswerUpdate) =>
    axios
      .put<IResponseId>(`${DEFAULT_EP}/answer/${answerId}`, answer)
      .then((response) => response.data),
  deleteAnswer: async (answerId: string) =>
    axios
      .delete(`${DEFAULT_EP}/answer/${answerId}`)
      .then((response) => response.data),
  postAnswerImage: async (answerId: string, image: File) => {
    const formData = new FormData();
    formData.append("file", image);

    return axios
      .post<IResponseUrl>(`${DEFAULT_EP}/answer/${answerId}/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response.data);
  },
  deleteAnswerImage: async (answerId: string) =>
    axios
      .delete(`${DEFAULT_EP}/answer/${answerId}/image`)
      .then((response) => response.data),
};

export default Answers;
