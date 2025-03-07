import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ImportantUpdateAlert() {
  return (
    <Alert className="mx-auto mt-5 max-w-[83.5rem] rounded-lg border border-blue-400/30 bg-transparent p-4 px-4 text-white">
      <AlertCircle className="mt-1 h-5 w-5 text-red-400" />
      <AlertTitle className="text-lg font-medium text-white">
        Important Update: Free Access for a Limited Time!
      </AlertTitle>
      <AlertDescription className="mt-2 text-blue-50">
        <p className="mb-2">
          To enhance the TorahNet experience, we have temporarily disabled the
          payment function. This means you can explore, learn, and teach freely
          while helping us improve the platform with your valuable feedback.
        </p>
        <p className="mb-2">
          <strong>For Teachers:</strong> This is a great opportunity to
          familiarize yourself with the system, connect with potential students,
          and build your presence on TorahNet.
        </p>
        <p className="mb-2">
          <strong>For Everyone:</strong> Take advantage of this special period
          to study Torah, share wisdom, and engage in meaningful learning.
        </p>
        <p className="font-medium">
          Enjoy this opportunity and help us shape the future of TorahNet!
        </p>
      </AlertDescription>
    </Alert>
  );
}
