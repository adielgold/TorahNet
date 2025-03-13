import { CheckCircle } from "lucide-react";

import { XCircle } from "lucide-react";

const ToasterTitle = ({
  title,
  type,
}: {
  title: string;
  type: "success" | "error";
}) => {
  return (
    <div className="flex items-center gap-2">
      {type === "success" ? (
        <CheckCircle className="h-5 w-5 text-green-500" />
      ) : (
        <XCircle className="h-5 w-5 text-red-500" />
      )}
      <p>{title}</p>
    </div>
  );
};

export default ToasterTitle;
