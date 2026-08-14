"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

type Props = {

  open:boolean;

  onOpenChange:(open:boolean)=>void;

  faqs:any[];

  onAssign:(faqId:string,sort:number)=>Promise<void>;

};

export default function AssignFAQDialog({

  open,

  onOpenChange,

  faqs,

  onAssign,

}:Props){

  const [faqId,setFaqId]=useState("");

  const [sort,setSort]=useState(0);

  return(

    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent>

        <DialogHeader>

          <DialogTitle>

            Assign FAQ

          </DialogTitle>

        </DialogHeader>

        <select
          className="w-full border rounded-lg p-3"
          value={faqId}
          onChange={(e)=>setFaqId(e.target.value)}
        >

          <option value="">Select FAQ</option>

          {faqs.map(faq=>(

            <option
              key={faq.id}
              value={faq.id}
            >
              {faq.question}
            </option>

          ))}

        </select>

        <input
          type="number"
          className="w-full border rounded-lg p-3"
          placeholder="Sort Order"
          value={sort}
          onChange={(e)=>setSort(Number(e.target.value))}
        />

        <DialogFooter>

          <Button
            variant="outline"
            onClick={()=>onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            onClick={async()=>{

              await onAssign(faqId,sort);

              onOpenChange(false);

            }}
          >
            Assign
          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  );

}