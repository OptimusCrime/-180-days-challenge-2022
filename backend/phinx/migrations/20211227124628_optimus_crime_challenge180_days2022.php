<?php

use Phinx\Migration\AbstractMigration;

class OptimusCrimeChallenge180Days2022 extends AbstractMigration
{
    public function change()
    {
        $this->table('entry')
            ->addColumn('added', 'date', ['null' => false])
            ->addColumn('comment', 'text', ['null' => true, 'default' => null])
            ->create();
    }
}
