"use client";

import { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import type { Project } from "@/types/project";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Project | null;
    onSave: (data: Project) => Promise<void>;
};

export default function SummaryCardDialog({
    open,
    onOpenChange,
    initialData,
    onSave,
}: Props) {
    const [form, setForm] = useState<Project>({
        title: "",
        description: "",
        level: "intermediate",
        image_url: "",
        sort_order: 0,
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (initialData) {
            setForm(initialData);
        } else {
            setForm({
                title: "",
                description: "",
                level: "intermediate",
                image_url: "",
                sort_order: 0,
            });
        }
    }, [initialData, open]);

    async function handleSubmit() {
        try {
            setSaving(true);

            await onSave(form);

            setForm({
                title: "",
                description: "",
                level: "intermediate",
                image_url: "",
                sort_order: 0,
            });

            onOpenChange(false);
        } finally {
            setSaving(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>

                <DialogHeader>
                    <DialogTitle>
                        {initialData ? "Edit Project" : "Add Project"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">

                    <input
                        placeholder="Project Title"
                        value={form.title}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                title: e.target.value
                            })
                        }
                        className="w-full border rounded-lg p-3"
                    />

                    <textarea
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                description: e.target.value,
                            })
                        }
                        className="w-full border rounded-lg p-3"
                    />

                    <select
                        value={form.level}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                level: e.target.value as
                                    | "beginner"
                                    | "intermediate"
                                    | "advanced",
                            })
                        }
                        className="w-full border rounded-lg p-3"
                    >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>

                    <input
                        placeholder="Image URL"
                        value={form.image_url}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                image_url: e.target.value,
                            })
                        }
                        className="w-full border rounded-lg p-3"
                    />

                    <input
                        type="number"
                        placeholder="Sort Order"
                        value={form.sort_order}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                sort_order: Number(e.target.value),
                            })
                        }
                        className="w-full border rounded-lg p-3"
                    />

                </div>

                <DialogFooter className="mt-6">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save"}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}