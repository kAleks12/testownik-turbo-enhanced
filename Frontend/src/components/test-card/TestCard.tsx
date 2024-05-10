import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { formatDate } from "@/shared/utils/helpers";
import { Link } from "react-router-dom";
import TestCardOptions from "./test-card-options/TestCardOptions";
import { ITestCardProps } from "./ITestCardProps";

const TestCard = (props: ITestCardProps) => {
  const { test } = props;
  const { onDeleted } = props;

  return (
    <Link to={`/solve/${test.id}`}>
      <Card className="hover:border-solid hover:border-current group">
        <CardHeader>
          <div className="flex flex-row">
            <div className="font-semibold leading-none tracking-tight content-center group-hover:text-2xl">
              {test.name}
            </div>
            <div className="grow"></div>
            <TestCardOptions testId={test.id ?? ""} onDeleted={onDeleted} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-column gap-2">
            <div className="text-primary font-bold">{test.course?.name}</div>
            <div className="text-muted-foreground italic">
              {test.course?.courseType}
            </div>
            {test.schoolYear && (
              <div className="text-muted-foreground italic">
                (Semestr: {test.schoolYear})
              </div>
            )}
          </div>
          <div className="flex flex-row">
            <p className="text-muted-foreground italic">Prowadzący:&nbsp;</p>
            <p>
              {test.course?.teacher.name} {test.course?.teacher.surname}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            <div>
              Ostatnia modyfikacja:&nbsp;
              {test.changedAt
                ? formatDate(test.changedAt)
                : test.createdAt
                  ? formatDate(test.createdAt)
                  : "Brak danych"}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default TestCard;
