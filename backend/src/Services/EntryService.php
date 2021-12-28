<?php
namespace OptimusCrime\Challenge180Days2022\Services;

use Carbon\Carbon;

use OptimusCrime\Challenge180Days2022\Models\Entry;

class EntryService
{
    public static function getCollection(): array
    {
        $entries = Entry
            ::orderBy('added', 'desc')
            ->get();

        $collection = [];
        foreach ($entries as $entry) {
            $collection[] = static::map($entry);
        }

        return $collection;
    }

    public static function create(string $date, ?string $comment): bool
    {
        $entry = new Entry();

        if (strlen($comment) > 0) {
            $entry->comment = $comment;
        }

        $entry->added = Carbon::createFromFormat('Y-m-d', $date, 'Europe/Oslo');

        return $entry->save();
    }

    private static function map(Entry $entry): array {
        return [
            'id' => $entry->id,
            'added' => $entry->added,
            'comment' => $entry->comment
        ];
    }
}