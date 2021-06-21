<?php
/**
 * PhpStorm.
 * User: Jay
 * Date: 2021/6/21
 */
echo '<pre>';

$res = null;
$put = null;

echo exec('sudo -u zlc bash ../deploy.sh', $put, $res);

print_r($put);