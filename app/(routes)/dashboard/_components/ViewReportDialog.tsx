import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SessionDetail } from "../medical-agent/[sessionId]/page";
import moment from "moment";

type Props = {
  record: SessionDetail;
};

function ViewReportDialog({ record }: Props) {
  const report = record?.report as any;

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"link"} size={"sm"}>
          View Report
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl border p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-blue-600 text-xl font-bold">🩺 Medical AI Voice Agent Report</DialogTitle>

          <DialogDescription asChild>
            <div className="mt-6 space-y-4 text-sm text-gray-700">
              {/* Session Info */}
              <div>
                <h3 className="text-blue-600 font-semibold border-b pb-1 mb-2">Session Info</h3>
                <p>
                  <strong>Doctor:</strong> {report?.agent}
                </p>
                <p>
                  <strong>User:</strong> {report?.user || "Anonymous"}
                </p>
                <p>
                  <strong>Consulted On:</strong> {moment(new Date(report?.timestamp)).format("MMMM Do YYYY, h:mm a")}
                </p>
              </div>

              {/* Diagnosis */}
              {report?.diagnosis && (
                <div>
                  <h3 className="text-blue-600 font-semibold border-b pb-1 mb-2">Diagnosis</h3>
                  <p>{report.diagnosis}</p>
                </div>
              )}

              {/* Symptoms */}
              {report?.symptoms?.length > 0 && (
                <div>
                  <h3 className="text-blue-600 font-semibold border-b pb-1 mb-2">Symptoms</h3>
                  <ul className="list-disc list-inside ml-3">
                    {report.symptoms.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Duration & Severity */}
              <div>
                <h3 className="text-blue-600 font-semibold border-b pb-1 mb-2">Duration & Severity</h3>
                <p>
                  <strong>Duration:</strong> {report?.duration || "Not specified"}
                </p>
                <p>
                  <strong>Severity:</strong> {report?.severity || "Unknown"}
                </p>
              </div>

              {/* Medications */}
              {report?.medications?.length > 0 && (
                <div>
                  <h3 className="text-blue-600 font-semibold border-b pb-1 mb-2">Medications</h3>
                  <ul className="list-disc list-inside ml-3">
                    {report.medications.map((med: string, idx: number) => (
                      <li key={idx}>{med}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Treatment */}
              {report?.treatment && (
                <div>
                  <h3 className="text-blue-600 font-semibold border-b pb-1 mb-2">Treatment</h3>
                  <p>{report.treatment}</p>
                </div>
              )}

              {/* Recommendations */}
              {report?.recommendations?.length > 0 && (
                <div>
                  <h3 className="text-blue-600 font-semibold border-b pb-1 mb-2">Recommendations</h3>
                  <ul className="list-disc list-inside ml-3">
                    {report.recommendations.map((rec: string, idx: number) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Precautions */}
              {report?.precautions?.length > 0 && (
                <div>
                  <h3 className="text-blue-600 font-semibold border-b pb-1 mb-2">Precautions</h3>
                  <ul className="list-disc list-inside ml-3">
                    {report.precautions.map((prec: string, idx: number) => (
                      <li key={idx}>{prec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ViewReportDialog;
