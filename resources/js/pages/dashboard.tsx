import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import CalendarAulas from '@/components/calendar-aulas';
import type { Course, Period } from '@/types/calendar';

interface Props {
    adminRequest: {
   
        course: Course;
        period: Period;
        status: 'pending' | 'approved' | 'rejected';
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

export default function Dashboard({ adminRequest }: Props) {
    const lessons =
    adminRequest.period.data.schedules.flatMap(
        (schedule: { lessons: any; }) => schedule.lessons ?? []
    )
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard do Representante" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                {/* Cards principais */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">

                    {/* Curso */}
                    <div className="flex flex-col justify-center rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                        <span className="text-sm text-muted-foreground">
                            Curso
                        </span>

                        <span className="text-2xl font-semibold">
                            {adminRequest.course.name}
                        </span>
                    </div>

                    {/* Período */}
                    <div className="flex flex-col justify-center rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                        <span className="text-sm text-muted-foreground">
                            Período
                        </span>

                        <span className="text-2xl font-semibold">
                            {adminRequest.period.data.number}
                        </span>
                    </div>

                    {/* Status */}
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

                {/* Área principal */}
                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-6 md:min-h-min dark:border-sidebar-border">

                    <h2 className="text-lg font-semibold mb-4">
                        Painel do Representante
                    </h2>

                    <p className="text-muted-foreground">
                        Aqui você poderá gerenciar o envio das fotos da lousa pra cada aula para a Inteligência Artificial gerar automaticamente o resumo das aulas para os alunos.
                    </p>

              
                        <div className="my-4">
                        <CalendarAulas selectedPeriod={adminRequest.period.data}   adminRequest={adminRequest.status === 'approved'} lessons={lessons}/>

                    </div>

                </div>

            </div>
        </AppLayout>
    );
}