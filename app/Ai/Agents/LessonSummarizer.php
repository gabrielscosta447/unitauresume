<?php

namespace App\Ai\Agents;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\HasStructuredOutput;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Messages\Message;
use Laravel\Ai\Promptable;
use Stringable;

class LessonSummarizer implements Agent,  HasStructuredOutput
{
    use Promptable;

    /**
     * Get the instructions that the agent should follow.
     */
  public function instructions(): Stringable|string
{
    return "
Você é um assistente educacional.

Sua tarefa:

- Analisar imagens de lousa de uma aula
- Identificar os conteúdos ensinados
- Criar um resumo claro e organizado
- Usar linguagem simples para estudantes

Regras:

- Não inventar conteúdo
- Organizar em parágrafos curtos
- Destacar fórmulas importantes
- Explicar conceitos quando possível

Objetivo:

Gerar um resumo que ajude estudantes a revisar a aula.
";
}
    

    /**
     * Get the agent's structured output schema definition.
     */
    public function schema(JsonSchema $schema): array
    {
        return [
              
            'summary' => $schema->string()->required(),
        ];
    }
}
