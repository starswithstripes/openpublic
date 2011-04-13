<?php

/**
 * Implementation of hook_strongarm().
 */
function phase2_blog_strongarm() {
  $export = array();

  $strongarm = new stdClass;
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'pathauto_node_blog_entry_pattern';
  $strongarm->value = 'blog/[node:created:custom:Y-m-d]/[node:title]';
  $export['pathauto_node_blog_entry_pattern'] = $strongarm;

  return $export;
}
