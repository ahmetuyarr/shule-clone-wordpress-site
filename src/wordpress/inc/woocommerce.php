
<?php
/**
 * WooCommerce compatibility file
 *
 * @package ShueBags
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * WooCommerce specific scripts & styles
 */
function shule_woocommerce_scripts() {
    wp_enqueue_style('shule-woocommerce', get_template_directory_uri() . '/woocommerce.css', array(), '1.0.0');
}
add_action('wp_enqueue_scripts', 'shule_woocommerce_scripts');

/**
 * Product gallery thumnail columns
 */
function shule_woocommerce_thumbnail_columns() {
    return 4;
}
add_filter('woocommerce_product_thumbnails_columns', 'shule_woocommerce_thumbnail_columns');

/**
 * Related Products Args
 */
function shule_related_products_args($args) {
    $args = array(
        'posts_per_page' => 4,
        'columns'        => 4,
        'orderby'        => 'rand',
    );

    return $args;
}
add_filter('woocommerce_output_related_products_args', 'shule_related_products_args');

/**
 * Remove default WooCommerce wrapper
 */
remove_action('woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10);
remove_action('woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10);

/**
 * Add custom WooCommerce wrapper
 */
function shule_woocommerce_wrapper_before() {
    echo '<div id="primary" class="content-area shule-container pt-24">';
    echo '<main id="main" class="site-main" role="main">';
}
add_action('woocommerce_before_main_content', 'shule_woocommerce_wrapper_before');

function shule_woocommerce_wrapper_after() {
    echo '</main>';
    echo '</div>';
}
add_action('woocommerce_after_main_content', 'shule_woocommerce_wrapper_after');

/**
 * Ensure cart contents update when products are added to the cart via AJAX
 */
function shule_add_to_cart_fragment($fragments) {
    ob_start();
    ?>
    <span class="cart-count absolute -top-1 -right-1 bg-shule-brown text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
        <?php echo WC()->cart->get_cart_contents_count(); ?>
    </span>
    <?php
    $fragments['.cart-count'] = ob_get_clean();
    return $fragments;
}
add_filter('woocommerce_add_to_cart_fragments', 'shule_add_to_cart_fragment');

/**
 * Remove sidebar from single product page
 */
function shule_remove_sidebar_product_pages() {
    if (is_product()) {
        remove_action('woocommerce_sidebar', 'woocommerce_get_sidebar', 10);
    }
}
add_action('wp', 'shule_remove_sidebar_product_pages');

/**
 * Remove heading from related products section
 */
add_filter('woocommerce_product_related_products_heading', 'shule_remove_related_products_heading');
function shule_remove_related_products_heading() {
    return '';
}

/**
 * Modify breadcrumb arguments
 */
add_filter('woocommerce_breadcrumb_defaults', 'shule_change_breadcrumb_args');
function shule_change_breadcrumb_args($args) {
    return array(
        'delimiter'   => '<span class="mx-2">/</span>',
        'wrap_before' => '<nav class="woocommerce-breadcrumb flex items-center flex-wrap text-sm" itemprop="breadcrumb">',
        'wrap_after'  => '</nav>',
        'before'      => '',
        'after'       => '',
        'home'        => _x('Ana Sayfa', 'breadcrumb', 'shulebags'),
    );
}

/**
 * Change number of products per row to 4
 */
add_filter('loop_shop_columns', 'shule_loop_columns', 999);
if (!function_exists('shule_loop_columns')) {
    function shule_loop_columns() {
        return 4;
    }
}

/**
 * Change number of products displayed per page
 */
add_filter('loop_shop_per_page', 'shule_products_per_page', 20);
function shule_products_per_page($cols) {
    return 12;
}

/**
 * Custom add to cart button text for simple products on product pages
 */
function shule_custom_add_to_cart_text() {
    return __('Sepete Ekle', 'shulebags');
}
add_filter('woocommerce_product_single_add_to_cart_text', 'shule_custom_add_to_cart_text');

/**
 * Wrap the add to cart button with a div for styling
 */
function shule_add_to_cart_button_wrapper() {
    echo '<div class="shule-button-wrapper">';
}
function shule_add_to_cart_button_wrapper_end() {
    echo '</div>';
}
add_action('woocommerce_before_add_to_cart_button', 'shule_add_to_cart_button_wrapper', 5);
add_action('woocommerce_after_add_to_cart_button', 'shule_add_to_cart_button_wrapper_end', 20);
