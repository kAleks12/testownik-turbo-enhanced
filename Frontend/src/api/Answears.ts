import { IAnswearUpdate, IResponseId, IResponseUrl } from "@/shared/interfaces";
import { DEFAULT_EP } from "@/shared/utils/constants";
import axios from "axios";

const Answears = {
  postAnswear: async (answear: IAnswearUpdate) =>
    axios
      .post<IResponseId>(`${DEFAULT_EP}/answer`, answear)
      .then((response) => response.data),
  putAnswear: async (answearId: string, answear: IAnswearUpdate) =>
    axios
      .put<IResponseId>(`${DEFAULT_EP}/answer/${answearId}`, answear)
      .then((response) => response.data),
  deleteAnswear: async (answearId: string) =>
    axios
      .delete(`${DEFAULT_EP}/answer/${answearId}`)
      .then((response) => response.data),
  postAnswearImage: async (answearId: string, image: File) => {
    const formData = new FormData();
    formData.append("file", image);

    return axios
      .post<IResponseUrl>(
        `${DEFAULT_EP}/answer/${answearId}/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => response.data);
  },
  deleteAnswearImage: async (answearId: string) =>
    axios
      .delete(`${DEFAULT_EP}/answer/${answearId}/image`)
      .then((response) => response.data),
};

export default Answears;