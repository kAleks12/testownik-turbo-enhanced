import { ICourse } from "@/shared/interfaces";
import { DEFAULT_EP } from "@/shared/utils/constants";
import axios from "axios";

const Courses = {
  getCourses: async () =>
    axios
      .get<ICourse[]>(`${DEFAULT_EP}/course`)
      .then((response) => response.data),
};

export default Courses;
