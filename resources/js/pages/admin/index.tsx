import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { admin } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administração',
        href: admin(),
    },
];

interface AdminRequest {
    id: number;
    status: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    course: {
        id: number;
        name: string;
    };
    period: {
        id: number;
        number: number;
    };
}

export default function Dashboard({
    adminRequests,
}: {
    adminRequests: AdminRequest[];
}) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';

            case 'rejected':
                return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';

            default:
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard do Administrador" />

            <div className="flex flex-col gap-6 p-6">
                {/* Cabeçalho */}
                <div className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
                    <h1 className="text-2xl font-bold">
                        Solicitações de Representante
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Aprove ou reprove as solicitações de representantes de
                        turma. Revise as informações antes de tomar uma decisão.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {adminRequests.length > 0 ? (
                        adminRequests.map((request) => (
                            <div
                                key={request.id}
                                className="rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-neutral-900 dark:border-neutral-800"
                            >
                                <div className="mb-5 flex items-center justify-between">
                                    <h2 className="text-lg font-bold">
                                        {request.course.name}
                                    </h2>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                                            request.status,
                                        )}`}
                                    >
                                        {request.status}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Solicitante
                                        </p>

                                        <p className="font-semibold">
                                            {request.user.name}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            E-mail
                                        </p>

                                        <p>{request.user.email}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Curso
                                        </p>

                                        <p>{request.course.name}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Período
                                        </p>

                                        <p>{request.period.number}º Período</p>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <button className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700">
                                        Aprovar
                                    </button>

                                    <button className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700">
                                        Reprovar
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
                            <h2 className="text-lg font-semibold">
                                Nenhuma solicitação encontrada
                            </h2>

                            <p className="mt-2">
                                Quando um aluno solicitar ser representante, ela
                                aparecerá aqui.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}