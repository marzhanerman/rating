<?php

namespace App\Helpers;

class StringHelper
{
    /**
     * Разделяет строку на код и название
     * Пример: "B001 Педагогика и психология"
     */
    public static function splitCodeAndName(?string $value): array
    {
        if (!$value) {
            return [
                'code' => null,
                'name' => null,
            ];
        }

        $value = trim($value);

        // Регулярка: код + пробел + остальное
        if (preg_match('/^([A-Za-z0-9]+)\s+(.*)$/u', $value, $matches)) {
            return [
                'code' => str_replace(['М', 'В'], ['M', 'B'], $matches[1]),
                'name' => $matches[2],
            ];
        }

        return [
            'code' => null,
            'name' => $value,
        ];
    }
}