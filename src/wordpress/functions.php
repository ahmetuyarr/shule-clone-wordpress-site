
<?php
/**
 * Shule Bags tema fonksiyonları ve tanımlamaları
 *
 * @package ShueBags
 */

if (!defined('ABSPATH')) {
    exit; // Doğrudan erişimi engelle
}

/**
 * Tema kurulumu
 */
function shule_setup() {
    // Çeviri desteği ekle
    load_theme_textdomain('shulebags', get_template_directory() . '/languages');

    // Otomatik feed bağlantıları ekle
    add_theme_support('automatic-feed-links');

    // Başlık etiketi ekle
    add_theme_support('title-tag');

    // Öne çıkan görselleri etkinleştir
    add_theme_support('post-thumbnails');

    // Menüleri kaydet
    register_nav_menus(array(
        'primary' => esc_html__('Ana Menü', 'shulebags'),
        'footer' => esc_html__('Alt Menü', 'shulebags'),
    ));

    // HTML5 desteği ekle
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));

    // WooCommerce desteği ekle
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');
}
add_action('after_setup_theme', 'shule_setup');

/**
 * Stil ve script dosyalarını kaydet
 */
function shule_scripts() {
    // Stil dosyaları
    wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap', array(), null);
    wp_enqueue_style('shule-style', get_stylesheet_uri(), array(), '1.0.0');
    
    // Script dosyaları
    wp_enqueue_script('shule-navigation', get_template_directory_uri() . '/js/navigation.js', array(), '1.0.0', true);
    wp_enqueue_script('shule-main', get_template_directory_uri() . '/js/main.js', array('jquery'), '1.0.0', true);

    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }
}
add_action('wp_enqueue_scripts', 'shule_scripts');

/**
 * Sidebar widget alanlarını kaydet
 */
function shule_widgets_init() {
    register_sidebar(array(
        'name'          => esc_html__('Sidebar', 'shulebags'),
        'id'            => 'sidebar-1',
        'description'   => esc_html__('Yan menüye widget ekleyin.', 'shulebags'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ));
    
    register_sidebar(array(
        'name'          => esc_html__('Footer Widgets', 'shulebags'),
        'id'            => 'footer-1',
        'description'   => esc_html__('Alt menüye widget ekleyin.', 'shulebags'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ));
}
add_action('widgets_init', 'shule_widgets_init');

/**
 * WooCommerce desteği
 */
require get_template_directory() . '/inc/woocommerce.php';

/**
 * Özel fonksiyonlar
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Özel başlık ve meta ayarları
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Özelleştirme seçenekleri
 */
require get_template_directory() . '/inc/customizer.php';
