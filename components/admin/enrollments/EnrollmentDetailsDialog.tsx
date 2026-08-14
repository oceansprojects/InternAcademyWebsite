"use client";

import {
  useState
} from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  updateEnrollmentStatus
} from "@/services/enrollment.api";


interface Props {
  enrollment: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


export default function EnrollmentDetailsDialog({
  enrollment,
  open,
  onOpenChange,
}: Props) {


  const [status, setStatus] = useState(
    enrollment?.status || "pending"
  );


  const [loading, setLoading] = useState(false);



  if (!enrollment) {
    return null;
  }



  async function updateStatus() {

    try {

      setLoading(true);


      await updateEnrollmentStatus(
        enrollment.id,
        status
      );


      onOpenChange(false);

      window.location.reload();


    } catch(error) {

      console.error(error);

      alert(
        "Failed to update status"
      );

    } finally {

      setLoading(false);

    }

  }



  return (

    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent
        className="
          max-w-3xl
          max-h-[85vh]
          overflow-hidden
          flex
          flex-col
        "
      >


        <DialogHeader>

          <DialogTitle className="text-xl">
            Enrollment Details
          </DialogTitle>

        </DialogHeader>



        {/* Scroll Area */}

        <div
          className="
            overflow-y-auto
            pr-3
            space-y-4
          "
        >



          {/* Student Details */}

          <section className="rounded-xl border p-4">

            <h3 className="font-semibold mb-4">
              Student Information
            </h3>


            <div className="
              grid
              md:grid-cols-2
              gap-x-8
              gap-y-4
              text-sm
            ">


              <Info
                label="Name"
                value={enrollment.student_name}
              />


              <Info
                label="Email"
                value={enrollment.student_email}
              />


              <Info
                label="Mobile"
                value={enrollment.mobile_number || "-"}
              />


              <Info
                label="Current Year"
                value={enrollment.current_year || "-"}
              />


            </div>


          </section>




          {/* Academic Details */}

          <section className="rounded-xl border p-4">


            <h3 className="font-semibold mb-4">
              Academic Details
            </h3>



            <div className="
              grid
              md:grid-cols-2
              gap-x-8
              gap-y-4
              text-sm
            ">


              <Info
                label="College"
                value={enrollment.college_name || "-"}
              />


              <Info
                label="Degree"
                value={enrollment.degree || "-"}
              />


              <Info
                label="Branch"
                value={enrollment.branch || "-"}
              />


            </div>


          </section>





          {/* Program Details */}

          <section className="rounded-xl border p-4">


            <h3 className="font-semibold mb-4">
              Program Details
            </h3>


            <div className="
              grid
              md:grid-cols-2
              gap-x-8
              gap-y-4
              text-sm
            ">


              <Info
                label="Program"
                value={enrollment.program_title}
              />


              <Info
                label="Category"
                value={enrollment.program_category || "-"}
              />


              <Info
                label="Duration"
                value={`${enrollment.duration_weeks} Weeks`}
              />


              <Info
                label="Mode"
                value={enrollment.batch_mode}
              />


              <Info
                label="Location"
                value={enrollment.location || "-"}
              />



            </div>


          </section>





          {/* Enrollment Details */}

          <section className="rounded-xl border p-4">


            <h3 className="font-semibold mb-4">
              Enrollment Information
            </h3>



            <div className="
              grid
              md:grid-cols-2
              gap-x-8
              gap-y-4
              text-sm
            ">


              <Info
                label="Current Status"
                value={enrollment.status}
              />


              <Info
                label="Payment Status"
                value={enrollment.payment_status}
              />


              <Info
                label="Amount Paid"
                value={`₹${enrollment.amount_paid || 0}`}
              />


              <Info
                label="Applied On"
                value={
                  new Date(
                    enrollment.enrolled_at
                  ).toLocaleDateString("en-IN")
                }
              />


            </div>


          </section>





          {/* Status Update */}

          <section className="
            rounded-xl
            border
            p-4
            bg-muted/20
          ">


            <h3 className="font-semibold mb-3">
              Update Application Status
            </h3>



            <div className="flex gap-3">


              <select

                value={status}

                onChange={(e)=>
                  setStatus(e.target.value)
                }

                className="
                  flex-1
                  border
                  rounded-lg
                  px-3
                  py-2
                  bg-background
                "

              >

                <option value="pending">
                  Pending
                </option>

                <option value="active">
                  Confirmed
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="dropped">
                  Dropped
                </option>


              </select>



              <Button

                onClick={updateStatus}

                disabled={loading}

              >

                {
                  loading
                    ?
                    "Saving..."
                    :
                    "Save"
                }

              </Button>



            </div>


          </section>



        </div>



      </DialogContent>


    </Dialog>

  );
}





function Info({
  label,
  value,
}:{
  label:string;
  value:any;
}){

  return (

    <div>

      <p className="text-muted-foreground text-xs">
        {label}
      </p>


      <p className="font-medium mt-1">
        {value}
      </p>

    </div>

  );

}