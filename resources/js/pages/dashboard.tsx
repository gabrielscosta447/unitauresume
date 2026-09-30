import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import CalendarAulas from '@/components/calendar-aulas';
import type { Course, Period, Lesson } from '@/types/calendar';

interface Props {
    adminRequest: {
        course: Course;
        status: 'pending' | 'approved' | 'rejected';
    };

    selectedPeriod: Period;
    lessons: Lesson[];

    filters: {
        start_date: string;
        end_date: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

export default function Dashboard({
    adminRequest,
    selectedPeriod,
    lessons,
    filters,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard do Representante" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">

                    <div className="flex flex-col justify-center rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                        <span className="text-sm text-muted-foreground">
                            Curso
                        </span>

                        <span className="text-2xl font-semibold">
                            {adminRequest.course.name}
                        </span>
                    </div>

                    <div className="flex flex-col justify-center rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                        <span className="text-sm text-muted-foreground">
                            Período
                        </span>

                        <span className="text-2xl font-semibold">
                            {selectedPeriod.number}
                        </span>
                    </div>

                    <div className="flex flex-col justify-center rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                        <span className="text-sm text-muted-foreground">
                            Status da Solicitação
                        </span>

                        <span
                            className={`
                                text-2xl font-semibold
                                ${
                                    adminRequest.status === 'approved'
                                        ? 'text-green-600'
                                        : adminRequest.status === 'rejected'
                                        ? 'text-red-600'
                                        : 'text-yellow-600'
                                }
                            `}
                        >
                            {adminRequest.status === 'pending' && 'Pendente'}
                            {adminRequest.status === 'approved' && 'Aprovado'}
                            {adminRequest.status === 'rejected' && 'Rejeitado'}
                        </span>
                    </div>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-6 md:min-h-min dark:border-sidebar-border">

                    <h2 className="mb-4 text-lg font-semibold">
                        Painel do Representante
                    </h2>

                    <p className="text-muted-foreground">
                        Aqui você poderá gerenciar o envio das fotos da lousa
                        pra cada aula para a Inteligência Artificial gerar
                        automaticamente o resumo das aulas para os alunos.
                    </p>

                    <div className="my-4">
                        <CalendarAulas
                            selectedPeriod={selectedPeriod}
                            adminRequest={adminRequest.status === 'approved'}
                            lessons={lessons}
                           filters={filters}
                        />
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}