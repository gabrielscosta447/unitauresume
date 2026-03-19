<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\Period;
use App\Models\Subject;
use App\Models\Schedule;

class CompleteUniversitySeeder extends Seeder
{
    public function run(): void
    {

        $weekdayMap = [
            'segunda' => 1,
            'terça' => 2,
            'quarta' => 3,
            'quinta' => 4,
            'sexta' => 5,
        ];

        $timeSlotMap = [
            '19:00' => 1,
            '21:00' => 2,
        ];
$courses = [

'Engenharia Civil' => [

/*
1º PERÍODO
*/

1 => [
['segunda','19:00','Desenho Universal'],
['terça','19:00','Responsabilidade Técnica no Sistema CREA/CONFEA'],
['quarta','19:00','Projeto Multidisciplinar'],
['quinta','19:00','Inovação Tecnológica'],
['sexta','19:00','Tópicos em Tecnologias da Informação'],

['segunda','21:00','Meio Ambiente e Sustentabilidade'],
['terça','21:00','Gestão de Empresas e Empreendedorismo'],
['quarta','21:00','Gestão de Projetos de Engenharia'],
['quinta','21:00','Humanidades e Ciências Sociais'],
['sexta','21:00','Tópicos em Tecnologias da Informação'],
],

/*
3º PERÍODO
*/

3 => [
['segunda','19:00','Expressão Gráfica II'],
['terça','19:00','Física (Lab)'],
['quarta','19:00','Geometria Analítica'],
['quinta','19:00','Cálculo I'],
['sexta','19:00','Física II'],

['segunda','21:00','Química Tecnológica dos Materiais'],
['terça','21:00','Projeto Integrador II'],
['quarta','21:00','Química (Lab)'],
['quinta','21:00','Cálculo I'],
['sexta','21:00','Leitura e Produção de Textos'],
],

/*
5º PERÍODO
*/

5 => [
['segunda','19:00','Urbanismo e Meio Ambiente'],
['terça','19:00','Economia Administração e Gerenciamento na Construção Civil'],
['quarta','19:00','Tecnologia da Construção Civil'],
['quinta','19:00','Projeto Arquitetônico e Engenharia Civil'],
['sexta','19:00','Língua Portuguesa: Leitura e Produção de Texto'],

['segunda','21:00','Ciências Humanas e Legislação Profissional'],
['terça','21:00','Conforto Ambiental'],
['quarta','21:00','Tecnologia da Construção Civil'],
['quinta','21:00','Projeto Arquitetônico e Engenharia Civil'],
['sexta','21:00','Metodologia Científica e Tecnológica'],
],

/*
7º PERÍODO
*/

7 => [
['segunda','19:00','Estruturas de Concreto Armado I'],
['terça','19:00','Teoria das Estruturas I'],
['quarta','19:00','Transportes II Estradas'],
['quinta','19:00','Materiais de Construção Civil II'],
['sexta','19:00','Topografia II e Georreferenciamento'],

['segunda','21:00','Estruturas de Concreto Armado I'],
['terça','21:00','Teoria das Estruturas I'],
['quarta','21:00','Transportes II Estradas'],
['quinta','21:00','Hidráulica II Conduto Livre'],
['sexta','21:00','Hidráulica II Conduto Livre'],
],

/*
8º / 9º PERÍODO
*/

8 => [
['segunda','19:00','Mecânica dos Solos II'],
['terça','19:00','Patologias e Recuperação na Construção Civil'],
['quarta','19:00','Fundações e Obras de Terra'],
['quinta','19:00','Estrutura de Madeira'],
['sexta','19:00','Saneamento Básico II'],

['segunda','21:00','Mecânica dos Solos II'],
['terça','21:00','Estruturas de Concreto Protendido'],
['quarta','21:00','Fundações e Obras de Terra'],
['quinta','21:00','Pontes e Grandes Estruturas I'],
['sexta','21:00','Estrutura de Madeira'],
],

/*
10º PERÍODO
*/

10 => [
['segunda','19:00','Estruturas Metálicas'],
['terça','19:00','Pontes e Grandes Estruturas II'],
['quarta','19:00','Mecânica dos Solos III Aplicações'],
['quinta','19:00','Fundações e Obras de Terra II'],
['sexta','19:00','Transportes IV'],

['segunda','21:00','Estruturas Metálicas'],
['terça','21:00','Transportes IV'],
['quarta','21:00','Mecânica dos Solos III Aplicações'],
['quinta','21:00','Fundações e Obras de Terra I'],
['sexta','21:00','Instalações Elétricas Prediais de Baixa Tensão'],
],

],
'Engenharia Mecânica' => [

/*
1º PERÍODO
*/

1 => [
['segunda','19:00','Desenho Universal'],
['terça','19:00','Responsabilidade Técnica no Sistema CREA/CONFEA'],
['quarta','19:00','Projeto Multidisciplinar'],
['quinta','19:00','Inovação Tecnológica'],
['sexta','19:00','Tópicos em Tecnologias da Informação'],

['segunda','21:00','Meio Ambiente e Sustentabilidade'],
['terça','21:00','Gestão de Empresas e Empreendedorismo'],
['quarta','21:00','Gestão de Projetos de Engenharia'],
['quinta','21:00','Humanidades e Ciências Sociais'],
['sexta','21:00','Tópicos em Tecnologias da Informação'],
],

/*
3º PERÍODO
*/

3 => [
['segunda','19:00','Expressão Gráfica II'],
['terça','19:00','Física (Lab)'],
['quarta','19:00','Geometria Analítica'],
['quinta','19:00','Cálculo I'],
['sexta','19:00','Física II'],

['segunda','21:00','Química Tecnológica dos Materiais'],
['terça','21:00','Projeto Integrador II'],
['quarta','21:00','Química (Lab)'],
['quinta','21:00','Cálculo I'],
['sexta','21:00','Leitura e Produção de Textos'],
],
/*
5º PERÍODO
*/
5 => [
['segunda','19:00','Tecnologia de Fabricação - Usinagem'],
['terça','19:00','Materiais de Construção Mecânica I'],
['quarta','19:00','Termodinâmica'],
['quinta','19:00','Termodinâmica'],
['sexta','19:00','Resistência dos Materiais Aplicada'],

['segunda','21:00','Tecnologia de Fabricação - Usinagem'],
['terça','21:00','Materiais de Construção Mecânica I'],
['quarta','21:00','Metodologia Científica para Engenharia'],
['quinta','21:00','Língua Portuguesa: Leitura e Produção de Texto'],
['sexta','21:00','Resistência dos Materiais Aplicada'],
],

/*
7º PERÍODO
*/
7 => [
['segunda','19:00','Sistemas Térmicos'],
['terça','19:00','Método dos Elementos Finitos'],
['quarta','19:00','Elementos de Máquina Aplicado'],
['quinta','19:00','Teoria das Estruturas Aplicada'],
['sexta','19:00','Tecnologia de Fabricação - Soldagem'],

['segunda','21:00','Sistemas Térmicos'],
['terça','21:00','Método dos Elementos Finitos'],
['quarta','21:00','Elementos de Máquina Aplicado'],
['quinta','21:00','Teoria das Estruturas Aplicada'],
['sexta','21:00','Tecnologia de Fabricação - Soldagem'],
],

/*
8º / 9º PERÍODO
*/
8 => [
['segunda','19:00','Mecânica da Fratura'],
['terça','19:00','Tecnologia de Fabricação - Fundição e Conformação'],
['quarta','19:00','Projeto de Aplicação Mecânica II'],
['quinta','19:00','Projeto de Aplicação Mecânica II'],
['sexta','19:00','Máquinas Térmicas'],

['segunda','21:00','Mecânica de Vibrações'],
['terça','21:00','Tecnologia de Fabricação - Fundição e Conformação'],
['quarta','21:00','Sistemas Fluidomecânicos'],
['quinta','21:00','Sistemas Fluidomecânicos'],
['sexta','21:00','Máquinas Térmicas'],
],

/*
10º PERÍODO
*/
10 => [
['segunda','19:00','Meio Ambiente e Sustentabilidade'],
['terça','19:00','Manutenção Industrial'],
['quarta','19:00','Administração e Economia em Engenharia'],
['quinta','19:00','Humanidades e Ciências Sociais'],
['sexta','19:00','Autoveículos'],

['segunda','21:00','Ergonomia e Fatores Humanos'],
['terça','21:00','Manutenção Industrial'],
['quarta','21:00','Administração e Economia em Engenharia'],
['quinta','21:00','Legislação e Ética Profissional'],
['sexta','21:00','Autoveículos'],
],
],
'Engenharia de Computação' => [

/*
1º PERÍODO
*/
1 => [
['segunda','19:00','Geografia Analítica'],
['terça','19:00','Eletrônica Lógica Digital'],
['quarta','19:00','Algoritmos e Lógica de Programação'],
['quinta','19:00','Pré-Cálculo'],
['sexta','19:00','Física I'],

['segunda','21:00','Introdução à Engenharia da Computação'],
['terça','21:00','Eletrônica Lógica Digital'],
['quarta','21:00','Algoritmos e Lógica de Programação'],
['quinta','21:00','Pré-Cálculo'],
['sexta','21:00','Física I'],
],

/*
3º PERÍODO
*/
3 => [
['segunda','19:00','Eletricidade e Circuitos Elétricos'],
['terça','19:00','Linguagem de Programação Orientada a Objetos I'],
['quarta','19:00','Sistemas Operacionais'],
['quinta','19:00','Estatística e Probabilidade'],
['sexta','19:00','Cálculo II'],

['segunda','21:00','Eletricidade e Circuitos Elétricos'],
['terça','21:00','Linguagem de Programação Orientada a Objetos I'],
['quarta','21:00','Sistemas Operacionais'],
['quinta','21:00','Estatística e Probabilidade'],
['sexta','21:00','Cálculo II'],
],

/*
5º PERÍODO
*/
5 => [
['segunda','19:00','Projeto Integrador INF IV'],
['terça','19:00','Banco de Dados I'],
['quarta','19:00','Engenharia de Software I'],
['quinta','19:00','Eletromagnetismo'],
['sexta','19:00','Estrutura de Dados I'],

['segunda','21:00','Matemática Discreta'],
['terça','21:00','Banco de Dados I'],
['quarta','21:00','Engenharia de Software I'],
['quinta','21:00','Eletromagnetismo'],
['sexta','21:00','Estrutura de Dados I'],
],
/*
7º PERÍODO
*/
7 => [
['segunda','19:00','Linguagens Formais'],
['terça','19:00','Inteligência Artificial I'],
['quarta','19:00','Proj Int INF V'],
['quinta','19:00','Eletrônica Digital'],
['sexta','19:00','Sistema de Controle'],

['segunda','21:00','Linguagens Formais'],
['terça','21:00','Inteligência Artificial I'],
['quarta','21:00','Análise de Algoritmo'],
['quinta','21:00','Eletrônica Digital'],
['sexta','21:00','Sistema de Controle'],
],

/*
9º PERÍODO
*/
9 => [
['segunda','19:00','Redes I'],
['terça','19:00','Sistemas Distribuídos'],
['quarta','19:00','Humanidades IBH'],
['quinta','19:00','Sistemas Embarcados'],
['sexta','19:00','Economia CeN'],

['segunda','21:00','Redes I'],
['terça','21:00','Sistemas Distribuídos'],
['quarta','21:00','Metodologia IBH'],
['quinta','21:00','Sistemas Embarcados'],
['sexta','21:00','Administração CeN'],
],
],
'Sistemas de Informação' => [

/*
1º PERÍODO
*/
1 => [
['segunda','19:00','Matemática Discreta'],
['terça','19:00','Proj Int INF I'],
['quarta','19:00','Ele Log Dig'],
['quinta','19:00','Alg Log Prog'],
['sexta','19:00','Pré-Cálculo'],

['segunda','21:00','Álgebra Linear'],
['terça','21:00','Sistemas Informação'],
['quarta','21:00','Ele Log Dig'],
['quinta','21:00','Alg Log Prog'],
['sexta','21:00','Pré-Cálculo'],
],

/*
3º PERÍODO
*/
3 => [
['segunda','19:00','Estrutura de Dados I'],
['terça','19:00','Sistemas Operacionais'],
['quarta','19:00','Banco I: Mod SQL Básico'],
['quinta','19:00','Ling. Prog. II'],
['sexta','19:00','Eng. Software I'],

['segunda','21:00','Estrutura de Dados I'],
['terça','21:00','Sistemas Operacionais'],
['quarta','21:00','Banco I: Mod SQL Básico'],
['quinta','21:00','Ling. Prog. II'],
['sexta','21:00','Eng. Software I'],
],

/*
5º PERÍODO
*/
5 => [
['segunda','19:00','Programação Móvel'],
['terça','19:00','Redes I'],
['quarta','19:00','Prog. Web II'],
['quinta','19:00','Metodologia'],
['sexta','19:00','Banco de Dados II'],

['segunda','21:00','Programação Móvel'],
['terça','21:00','Redes I'],
['quarta','21:00','Prog. Web II'],
['quinta','21:00','Estatística e Probabilidade'],
['sexta','21:00','Banco de Dados II'],
],

/*
6º PERÍODO
*/
6 => [
['segunda','19:00','Inteligência Artificial'],
['terça','19:00','Ética e Legislação'],
['quarta','19:00','Redes II'],
['quinta','19:00','IHC'],
['sexta','19:00','Prog. Para Jogos'],

['segunda','21:00','Inteligência Artificial'],
['terça','21:00','Ética e Legislação'],
['quarta','21:00','Redes II'],
['quinta','21:00','Empreendedorismo'],
['sexta','21:00','Prog. Para Jogos'],
],

/*
7º PERÍODO
*/
7 => [
['segunda','19:00','Sistemas Distribuídos'],
['terça','19:00','Administração CeN'],
['quarta','19:00','Humanidades'],
['quinta','19:00','SAD'],
['sexta','19:00','Economia CeN'],

['segunda','21:00','Sistemas Distribuídos'],
['terça','21:00','Matemática Financeira'],
['quarta','21:00','Governança de TI'],
['quinta','21:00','SAD'],
['sexta','21:00','Governança de TI'],
],

],
'Análise e Desenvolvimento de Sistemas' => [

/*
1º PERÍODO
*/
1 => [
['segunda','19:00','Matemática Discreta'],
['terça','19:00','Ele Log Dig'],
['quarta','19:00','Pré-Cálculo'],
['quinta','19:00','Projeto Integrador INF I'],
['sexta','19:00','Alg Log Prog'],

['segunda','21:00','Álgebra Linear'],
['terça','21:00','Ele Log Dig'],
['quarta','21:00','Pré-Cálculo'],
['quinta','21:00','Sistemas de Informação'],
['sexta','21:00','Alg Log Prog'],
],

/*
3º PERÍODO
*/
3 => [
['segunda','19:00','Linguagem Prog. II'],
['terça','19:00','Estrutura de Dados I'],
['quarta','19:00','Sistemas Operacionais'],
['quinta','19:00','Banco de Dados I'],
['sexta','19:00','Eng. Software'],

['segunda','21:00','Linguagem Prog. II'],
['terça','21:00','Estrutura de Dados I'],
['quarta','21:00','Sistemas Operacionais'],
['quinta','21:00','Banco de Dados I'],
['sexta','21:00','Eng. Software'],
],

/*
4º PERÍODO
*/
4 => [
['segunda','19:00','Banco de Dados II'],
['terça','19:00','Proj Integrador IV'],
['quarta','19:00','Língua Portuguesa'],
['quinta','19:00','Estruturas de Dados'],
['sexta','19:00','Eng. de Software'],

['segunda','21:00','Banco de Dados II'],
['terça','21:00','Programação para Web I'],
['quarta','21:00','Língua Portuguesa'],
['quinta','21:00','Estruturas de Dados'],
['sexta','21:00','Eng. de Software'],
],

/*
5º PERÍODO
*/
5 => [
['segunda','19:00','Programação Móvel'],
['terça','19:00','Redes I'],
['quarta','19:00','Prog. Web II'],
['quinta','19:00','Metodologia'],
['sexta','19:00','Banco de Dados II'],

['segunda','21:00','Programação Móvel'],
['terça','21:00','Redes I'],
['quarta','21:00','Prog. Web II'],
['quinta','21:00','Estatística e Probabilidade'],
['sexta','21:00','Banco de Dados II'],
],

/*
6º PERÍODO
*/
6 => [
['segunda','19:00','Inteligência Artificial'],
['terça','19:00','Ética e Legislação'],
['quarta','19:00','Redes II'],
['quinta','19:00','IHC'],
['sexta','19:00','Prog. Para Jogos'],

['segunda','21:00','Inteligência Artificial'],
['terça','21:00','Ética e Legislação'],
['quarta','21:00','Redes II'],
['quinta','21:00','Empreendedorismo'],
['sexta','21:00','Prog. Para Jogos'],
],

],
];
foreach ($courses as $courseName => $periods) {

    // COURSE
    $course = Course::firstOrCreate([
        'name' => $courseName
    ]);

    foreach ($periods as $periodNumber => $entries) {

        // PERIOD
        $period = Period::firstOrCreate([
            'number' => $periodNumber,
            'course_id' => $course->id
        ]);

        foreach ($entries as $entry) {

            [$weekday, $time, $subjectName] = $entry;

            // SUBJECT
            $subject = Subject::firstOrCreate([
                'name' => trim($subjectName)
            ]);

            // SCHEDULE
            Schedule::create([
                'course_id'    => $course->id,
                'period_id'    => $period->id,
                'subject_id'   => $subject->id,
                'weekday'      => $weekdayMap[$weekday],
                'time_slot_id' => $timeSlotMap[$time],
            ]);
        }
    }
}
      
    }
}