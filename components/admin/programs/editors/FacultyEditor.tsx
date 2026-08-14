"use client";

import { useEffect, useState } from "react";

import FacultyDialog from "@/components/admin/dialogs/FacultyDialog";
import FacultyExpertiseDialog from "@/components/admin/dialogs/FacultyExpertiseDialog";

import {
    getFaculty,
    createFaculty,
    updateFaculty,
    deleteFaculty,
} from "@/services/faculty.api";

import {
    getFacultyExpertise,
    createFacultyExpertise,
    updateFacultyExpertise,
    deleteFacultyExpertise,
} from "@/services/faculty-expertise.api";

import type { Faculty } from "@/types/faculty";
import type { FacultyExpertise } from "@/types/faculty-expertise";
import type { Program } from "@/types/program";

import { Button } from "@/components/ui/button";

type Props = {
    program: Program;
};

export default function FacultyEditor({ program }: Props) {
    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [loading, setLoading] = useState(true);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingFaculty, setEditingFaculty] =
        useState<Faculty | null>(null);

    const [expertiseDialogOpen, setExpertiseDialogOpen] =
        useState(false);

    const [selectedFaculty, setSelectedFaculty] =
        useState<Faculty | null>(null);

    const [expertise, setExpertise] = useState<
        FacultyExpertise[]
    >([]);

    const [editingExpertise, setEditingExpertise] =
        useState<FacultyExpertise | null>(null);

    async function loadFaculty() {
        try {
            const res = await getFaculty(program.id);
            setFaculty(res.data || []);
        } finally {
            setLoading(false);
        }
    }

    async function loadExpertise(facultyId: string) {
        const res = await getFacultyExpertise(facultyId);
        setExpertise(res.data || []);
    }

    async function handleFacultySave(data: Faculty) {
        if (data.id) {
            await updateFaculty(data.id, {
                name: data.name,
                role: data.role,
                institution: data.institution,
                bio: data.bio,
                avatar_url: data.avatar_url,
                linkedin_url: data.linkedin_url,

            });
        } else {
            await createFaculty(program.id, {
                name: data.name,
                role: data.role,
                institution: data.institution,
                bio: data.bio,
                avatar_url: data.avatar_url,
                linkedin_url: data.linkedin_url,
                
            });
        }

        setDialogOpen(false);
        setEditingFaculty(null);

        await loadFaculty();
    }

    async function handleExpertiseSave(
        item: FacultyExpertise
    ) {
        if (!selectedFaculty) return;

        if (item.id) {
            await updateFacultyExpertise(item.id, {
                tag: item.tag,
                sort_order: item.sort_order,
            });
        } else {
            await createFacultyExpertise(
                selectedFaculty.id!,
                {
                    tag: item.tag,
                    sort_order: item.sort_order,
                }
            );
        }

        setExpertiseDialogOpen(false);
        setEditingExpertise(null);

        await loadExpertise(selectedFaculty.id!);
    }

    useEffect(() => {
        loadFaculty();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div>

            <div className="flex justify-between items-center mb-6">

                <h2 className="text-2xl font-bold">
                    Faculty
                </h2>

                <Button
                    onClick={() => {
                        setEditingFaculty(null);
                        setDialogOpen(true);
                    }}
                >
                    + Add Faculty
                </Button>

            </div>

            <div className="space-y-5">

                {faculty.map((member) => (

                    <div
                        key={member.id}
                        className="border rounded-xl p-5"
                    >

                        <div className="flex justify-between">

                            <div className="flex-1">

                                <h3 className="font-semibold text-lg">
                                    {member.name}
                                </h3>

                                <p>{member.role}</p>

                                <p className="text-gray-500">
                                    {member.institution}
                                </p>

                                <p className="mt-2">
                                    {member.bio}
                                </p>

                                {member.linkedin_url && (
                                    <a
                                        href={member.linkedin_url}
                                        target="_blank"
                                        className="text-blue-600 text-sm"
                                    >
                                        LinkedIn
                                    </a>
                                )}

                            </div>

                            <div className="flex flex-col gap-2">

                                <Button
                                    variant="secondary"
                                    onClick={async () => {
                                        setSelectedFaculty(member);

                                        if (member.id) {
                                            await loadExpertise(member.id);
                                        }
                                    }}
                                >
                                    Manage Expertise
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setEditingFaculty(member);
                                        setDialogOpen(true);
                                    }}
                                >
                                    Edit
                                </Button>

                                <Button
                                    variant="destructive"
                                    onClick={async () => {

                                        const ok = window.confirm(
                                            "Delete this faculty?"
                                        );

                                        if (!ok) return;

                                        await deleteFaculty(member.id!);

                                        await loadFaculty();

                                    }}
                                >
                                    Delete
                                </Button>

                            </div>

                        </div>

                        {selectedFaculty?.id === member.id && (

                            <div className="mt-6 border-t pt-5">

                                <div className="flex justify-between mb-4">

                                    <h4 className="font-semibold">
                                        Expertise
                                    </h4>

                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setEditingExpertise(null);
                                            setExpertiseDialogOpen(true);
                                        }}
                                    >
                                        + Add Expertise
                                    </Button>

                                </div>

                                <div className="space-y-2">

                                    {expertise.map((item) => (

                                        <div
                                            key={item.id}
                                            className="flex justify-between border rounded-lg p-3"
                                        >

                                            <span>{item.tag}</span>

                                            <div className="flex gap-2">

                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setEditingExpertise(item);
                                                        setExpertiseDialogOpen(true);
                                                    }}
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={async () => {
                                                        const ok = window.confirm("Delete expertise?");

                                                        if (!ok) return;

                                                        await deleteFacultyExpertise(item.id!);

                                                        const facultyId = selectedFaculty?.id;

                                                        if (!facultyId) return;

                                                        await loadExpertise(facultyId);
                                                    }}
                                                >
                                                    Delete
                                                </Button>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            </div>

                        )}

                    </div>

                ))}

            </div>

            <FacultyDialog
    programId={program.id}
    open={dialogOpen}
    onOpenChange={setDialogOpen}
    initialData={editingFaculty}
    onSave={handleFacultySave}
/>

            <FacultyExpertiseDialog
                open={expertiseDialogOpen}
                onOpenChange={setExpertiseDialogOpen}
                initialData={editingExpertise}
                onSave={handleExpertiseSave}
            />

        </div>
    );
}