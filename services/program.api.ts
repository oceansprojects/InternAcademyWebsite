type ProgramFormData = {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  duration_weeks: number;
  batch_mode: string;
  schedule: string;
  location: string;

  base_price: number;
  discounted_price: number;

  syllabus_url: string;
  demo_video_url: string;
  demo_video_duration_mins: number;
  demo_video_description: string;

  meta_title: string;
  meta_description: string;

  is_published: boolean;
  is_popular: boolean;

  cohort_start: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data?: any;
};

export async function getProgramById(id: string) {
  const response = await fetch(`/api/admin/programs/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch program");
  }

  return data.data;
}

export async function updateProgram(
  id: string,
  formData: ProgramFormData
): Promise<ApiResponse> {
  try {
    const response = await fetch(`/api/admin/programs/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to update program",
      };
    }

    return {
      success: true,
      message: "Program updated successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error updating program:", error);

    return {
      success: false,
      message: "An error occurred while updating the program",
    };
  }
}

export async function getPrograms(): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/admin/programs");

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch programs",
      };
    }

    return {
      success: true,
      message: "Programs fetched successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error fetching programs:", error);

    return {
      success: false,
      message: "An error occurred while fetching programs",
    };
  }
}

export async function deleteProgram(id: string) {
  const response = await fetch(`/api/admin/programs/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete program");
  }

  return data;
}

export async function createProgram(
  formData: ProgramFormData
): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/admin/programs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to create program",
      };
    }

    return {
      success: true,
      message: "Program created successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error creating program:", error);
    return {
      success: false,
      message: "An error occurred while creating the program",
    };
  }
}
