"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CategoryCombobox from "@/components/admin/programs/CategoryCombobox";

type Props = {
    form: any;
    setForm: React.Dispatch<React.SetStateAction<any>>;
    categories: string[];
};

export default function ProgramForm({
    form,
    setForm,
    categories,
}: Props) {

  function updateField(
    key: string,
    value: string | number
  ) {
    setForm((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  }

  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }



  return (
    <div className="grid grid-cols-2 gap-6">

      <div>
        <Label>Title</Label>

        <Input
          value={form.title}
          onChange={(e) => {
            const title = e.target.value;

            setForm((prev: any) => ({
              ...prev,
              title,
              slug:
                prev.slug === "" ||
                  prev.slug === generateSlug(prev.title)
                  ? generateSlug(title)
                  : prev.slug,
            }));
          }}
        />
      </div>

      <div>
        <Label>Subtitle</Label>

        <Input
          value={form.subtitle}
          onChange={(e) =>
            updateField("subtitle", e.target.value)
          }
        />
      </div>

      <div>
        <Label>Slug</Label>

        <Input
          value={form.slug}
          onChange={(e) =>
            setForm((prev: any) => ({
              ...prev,
              slug: e.target.value,
            }))
          }
        />
      </div>

     <div>
  <label className="block mb-2 text-sm font-semibold text-gray-700">
    Category
  </label>

<CategoryCombobox
    value={form.category}
    categories={categories}
    onChange={(value) =>
        setForm((prev: any) => ({
            ...prev,
            category: value,
        }))
    }
/>
</div>

      <div>
        <Label>Duration (Weeks)</Label>

        <Input
          type="number"
          value={form.duration_weeks}
          onChange={(e) =>
            updateField(
              "duration_weeks",
              Number(e.target.value)
            )
          }
        />
      </div>

      <div>
        <Label>Batch Mode</Label>

        <Input
          value={form.batch_mode}
          onChange={(e) =>
            updateField("batch_mode", e.target.value)
          }
        />
      </div>

      <div>
        <Label>Schedule</Label>

        <Input
          value={form.schedule}
          onChange={(e) =>
            updateField("schedule", e.target.value)
          }
        />
      </div>

      <div>
        <Label>Location</Label>

        <Input
          value={form.location}
          onChange={(e) =>
            updateField("location", e.target.value)
          }
        />
      </div>

      <div>
        <Label>Base Price</Label>

        <Input
          type="number"
          value={form.base_price}
          onChange={(e) =>
            updateField(
              "base_price",
              Number(e.target.value)
            )
          }
        />
      </div>

      <div>
        <Label>Discount Price</Label>

        <Input
          type="number"
          value={form.discounted_price}
          onChange={(e) =>
            updateField(
              "discounted_price",
              Number(e.target.value)
            )
          }
        />
      </div>

    </div>
  );
}