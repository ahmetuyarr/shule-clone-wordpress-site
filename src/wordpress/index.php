
<?php
/**
 * Ana dosya
 *
 * Bu dosya WordPress temasının ana dosyasıdır.
 *
 * @package ShueBags
 */

get_header(); 

if (is_front_page()) {
    get_template_part('template-parts/content', 'home');
} elseif (is_product()) {
    get_template_part('template-parts/content', 'product');
} elseif (is_product_category()) {
    get_template_part('template-parts/content', 'products');
} elseif (is_page()) {
    get_template_part('template-parts/content', 'page');
} else {
    get_template_part('template-parts/content', 'none');
}

get_footer();
