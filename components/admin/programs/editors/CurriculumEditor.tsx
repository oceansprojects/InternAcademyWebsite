"use client";

import { useEffect, useState } from "react";

import CurriculumModuleDialog from "@/components/admin/dialogs/CurriculumModuleDialog";
import CurriculumTopicDialog from "@/components/admin/dialogs/CurriculumTopicDialog";

import {
    getCurriculumModules,
    createCurriculumModule,
    updateCurriculumModule,
    deleteCurriculumModule,
} from "@/services/curriculum-module.api";

import {
    getCurriculumTopics,
    createCurriculumTopic,
    updateCurriculumTopic,
    deleteCurriculumTopic,
} from "@/services/curriculum-topic.api";

import type { CurriculumModule } from "@/types/curriculum-module";
import type { CurriculumTopic } from "@/types/curriculum-topic";
import type { Program } from "@/types/program";

import { Button } from "@/components/ui/button";

type Props = {
    program: Program;
};

export default function CurriculumEditor({ program }: Props) {
    const [modules, setModules] = useState<CurriculumModule[]>([]);
    const [topics, setTopics] = useState<CurriculumTopic[]>([]);
    const [loading, setLoading] = useState(true);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingModule, setEditingModule] =
        useState<CurriculumModule | null>(null);

    const [topicDialogOpen, setTopicDialogOpen] =
        useState(false);

    const [editingTopic, setEditingTopic] =
        useState<CurriculumTopic | null>(null);

    const [selectedModule, setSelectedModule] =
        useState<CurriculumModule | null>(null);

    async function loadModules() {
        try {
            const res = await getCurriculumModules(program.id);
            setModules(res.data || []);
        } finally {
            setLoading(false);
        }
    }

    async function loadTopics(moduleId: string) {
        const res = await getCurriculumTopics(moduleId);
        setTopics(res.data || []);
    }

    async function handleModuleSave(
        module: CurriculumModule
    ) {
        if (module.id) {
            await updateCurriculumModule(
                module.id,
                {
                    phase_label: module.phase_label,
                    title: module.title,
                    objective: module.objective,
                    sort_order: module.sort_order,
                }
            );
        } else {
            await createCurriculumModule(
                program.id,
                {
                    phase_label: module.phase_label,
                    title: module.title,
                    objective: module.objective,
                    sort_order: module.sort_order,
                }
            );
        }

        setDialogOpen(false);
        setEditingModule(null);

        await loadModules();
    }

    async function handleTopicSave(
        topic: CurriculumTopic
    ) {
        if (!selectedModule) return;

        if (topic.id) {
            await updateCurriculumTopic(
                topic.id,
                {
                    topic: topic.topic,
                    sort_order: topic.sort_order,
                }
            );
        } else {
            await createCurriculumTopic(
                selectedModule.id!,
                {
                    topic: topic.topic,
                    sort_order: topic.sort_order,
                }
            );
        }

        setTopicDialogOpen(false);
        setEditingTopic(null);

        await loadTopics(selectedModule.id!);
    }

    useEffect(() => {
        loadModules();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>

            <div className="flex justify-between items-center mb-6">

                <h2 className="text-2xl font-bold">
                    Curriculum
                </h2>

                <Button
                    onClick={() => {
                        setEditingModule(null);
                        setDialogOpen(true);
                    }}
                >
                    + Add Module
                </Button>

            </div>

            <div className="space-y-6">

                {modules.map((module) => (

                    <div
                        key={module.id}
                        className="border rounded-xl p-5"
                    >

                        <div className="flex justify-between">

                            <div className="flex-1">

                                <p className="text-blue-600 font-semibold">
                                    {module.phase_label}
                                </p>

                                <h3 className="text-xl font-bold mt-1">
                                    {module.title}
                                </h3>

                                {module.objective && (
                                    <p className="italic text-gray-600 mt-2">
                                        {module.objective}
                                    </p>
                                )}

                            </div>

                            <div className="flex flex-col gap-2">

                                <Button
                                    variant="secondary"
                                    onClick={async () => {
                                        setSelectedModule(module);

                                        if (module.id) {
                                            await loadTopics(module.id);
                                        }
                                    }}
                                >
                                    Manage Topics
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setEditingModule(module);
                                        setDialogOpen(true);
                                    }}
                                >
                                    Edit
                                </Button>

                                <Button
                                    variant="destructive"
                                    onClick={async () => {

                                        const ok = window.confirm(
                                            "Delete this module?"
                                        );

                                        if (!ok) return;

                                        await deleteCurriculumModule(
                                            module.id!
                                        );

                                        await loadModules();

                                    }}
                                >
                                    Delete
                                </Button>

                            </div>

                        </div>

                        {selectedModule?.id === module.id && (

                            <div className="mt-6 border-t pt-5">

                                <div className="flex justify-between items-center mb-4">

                                    <h4 className="font-semibold">
                                        Topics
                                    </h4>

                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setEditingTopic(null);
                                            setTopicDialogOpen(true);
                                        }}
                                    >
                                        + Add Topic
                                    </Button>

                                </div>

                                <div className="space-y-2">

                                    {topics.map((topic) => (

                                        <div
                                            key={topic.id}
                                            className="flex justify-between items-center border rounded-lg p-3"
                                        >

                                            <span>{topic.topic}</span>

                                            <div className="flex gap-2">

                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setEditingTopic(topic);
                                                        setTopicDialogOpen(true);
                                                    }}
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={async () => {

                                                        const ok = window.confirm(
                                                            "Delete this topic?"
                                                        );

                                                        if (!ok) return;

                                                        await deleteCurriculumTopic(
                                                            topic.id!
                                                        );

                                                        if (selectedModule?.id) {
                                                            await loadTopics(
                                                                selectedModule.id
                                                            );
                                                        }

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

            <CurriculumModuleDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                initialData={editingModule}
                onSave={handleModuleSave}
            />

            <CurriculumTopicDialog
                open={topicDialogOpen}
                onOpenChange={setTopicDialogOpen}
                initialData={editingTopic}
                onSave={handleTopicSave}
            />

        </div>
    );
}