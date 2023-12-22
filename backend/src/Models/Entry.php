<?php
namespace OptimusCrime\Challenge180Days\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method orderBy(string $string, string $string1)
 */
class Entry extends Model
{
    protected $table = 'entry';
    public $timestamps = false;
}
