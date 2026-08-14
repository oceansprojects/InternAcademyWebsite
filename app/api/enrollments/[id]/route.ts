import { NextResponse } from "next/server";
import { updateEnrollmentDetails } from "@/services/enrollment.service";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  req: Request,
  { params }: Props
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, payment_status, amount_paid } = body;

    if (!status && !payment_status && amount_paid === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one field (status, payment_status, or amount_paid) is required",
        },
        {
          status: 400,
        }
      );
    }

    const updated = await updateEnrollmentDetails(id, {
      status,
      payment_status,
      amount_paid: amount_paid !== undefined ? Number(amount_paid) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("UPDATE ENROLLMENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update enrollment",
      },
      {
        status: 500,
      }
    );
  }
}