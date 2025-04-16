
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
 * Sayfanın scroll edilip edilmediğini kontrol eder
 */
function is_scrolled() {
    // JavaScript ile set edilen cookie'yi kontrol et
    if (isset($_COOKIE['scrolled']) && $_COOKIE['scrolled'] === 'true') {
        return true;
    }
    return false;
}

/**
 * Tema özelleştiricisi ayarlarını kaydet
 */
function shule_customize_register($wp_customize) {
    // Ana Sayfa Hero Bölümü
    $wp_customize->add_section('shule_home_hero', array(
        'title' => esc_html__('Ana Sayfa Hero', 'shulebags'),
        'priority' => 30,
    ));
    
    $wp_customize->add_setting('home_hero_image', array(
        'default' => get_template_directory_uri() . '/assets/images/hero.jpg',
        'sanitize_callback' => 'esc_url_raw',
    ));
    
    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'home_hero_image', array(
        'label' => esc_html__('Hero Görsel', 'shulebags'),
        'section' => 'shule_home_hero',
    )));
    
    $wp_customize->add_setting('home_hero_title', array(
        'default' => esc_html__('2024 Yaz Koleksiyonu', 'shulebags'),
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('home_hero_title', array(
        'label' => esc_html__('Hero Başlık', 'shulebags'),
        'section' => 'shule_home_hero',
        'type' => 'text',
    ));
    
    $wp_customize->add_setting('home_hero_subtitle', array(
        'default' => esc_html__('Seyahatlerin ve yaz günlerinin vazgeçilmezi hasır ve örgü çantalar şimdi online mağazamızda.', 'shulebags'),
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('home_hero_subtitle', array(
        'label' => esc_html__('Hero Alt Başlık', 'shulebags'),
        'section' => 'shule_home_hero',
        'type' => 'textarea',
    ));
    
    $wp_customize->add_setting('home_hero_button_text', array(
        'default' => esc_html__('Şimdi Keşfet', 'shulebags'),
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('home_hero_button_text', array(
        'label' => esc_html__('Hero Button Metni', 'shulebags'),
        'section' => 'shule_home_hero',
        'type' => 'text',
    ));
    
    $wp_customize->add_setting('home_hero_button_link', array(
        'default' => wc_get_page_permalink('shop'),
        'sanitize_callback' => 'esc_url_raw',
    ));
    
    $wp_customize->add_control('home_hero_button_link', array(
        'label' => esc_html__('Hero Button Link', 'shulebags'),
        'section' => 'shule_home_hero',
        'type' => 'url',
    ));
    
    // Ana Sayfa Koleksiyon Bölümü
    $wp_customize->add_section('shule_home_collection', array(
        'title' => esc_html__('Ana Sayfa Koleksiyon', 'shulebags'),
        'priority' => 40,
    ));
    
    $wp_customize->add_setting('home_collection_title', array(
        'default' => esc_html__('Koleksiyonlarımız', 'shulebags'),
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('home_collection_title', array(
        'label' => esc_html__('Koleksiyon Başlık', 'shulebags'),
        'section' => 'shule_home_collection',
        'type' => 'text',
    ));
    
    $wp_customize->add_setting('home_collection_subtitle', array(
        'default' => esc_html__('Tarzınıza uygun el yapımı hasır ve örgü çantalarımızı keşfedin.', 'shulebags'),
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('home_collection_subtitle', array(
        'label' => esc_html__('Koleksiyon Alt Başlık', 'shulebags'),
        'section' => 'shule_home_collection',
        'type' => 'textarea',
    ));
    
    // Ana Sayfa Öne Çıkan Ürünler Bölümü
    $wp_customize->add_section('shule_home_featured', array(
        'title' => esc_html__('Ana Sayfa Öne Çıkan Ürünler', 'shulebags'),
        'priority' => 50,
    ));
    
    $wp_customize->add_setting('home_featured_title', array(
        'default' => esc_html__('Öne Çıkan Ürünler', 'shulebags'),
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('home_featured_title', array(
        'label' => esc_html__('Öne Çıkan Ürünler Başlık', 'shulebags'),
        'section' => 'shule_home_featured',
        'type' => 'text',
    ));
    
    $wp_customize->add_setting('home_featured_subtitle', array(
        'default' => esc_html__('El yapımı, zarif ve yaz aylarının vazgeçilmezi çantalar.', 'shulebags'),
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('home_featured_subtitle', array(
        'label' => esc_html__('Öne Çıkan Ürünler Alt Başlık', 'shulebags'),
        'section' => 'shule_home_featured',
        'type' => 'textarea',
    ));
    
    $wp_customize->add_setting('home_featured_button_text', array(
        'default' => esc_html__('Tüm Ürünleri Keşfet', 'shulebags'),
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('home_featured_button_text', array(
        'label' => esc_html__('Öne Çıkan Ürünler Button Metni', 'shulebags'),
        'section' => 'shule_home_featured',
        'type' => 'text',
    ));
    
    // Ana Sayfa Instagram Bölümü
    $wp_customize->add_section('shule_home_instagram', array(
        'title' => esc_html__('Ana Sayfa Instagram', 'shulebags'),
        'priority' => 60,
    ));
    
    $wp_customize->add_setting('home_instagram_text', array(
        'default' => esc_html__('Bizi Instagram\'da takip edin ve son koleksiyonlarımızı keşfedin.', 'shulebags'),
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('home_instagram_text', array(
        'label' => esc_html__('Instagram Metni', 'shulebags'),
        'section' => 'shule_home_instagram',
        'type' => 'textarea',
    ));
    
    $wp_customize->add_setting('instagram_username', array(
        'default' => 'shulebags',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('instagram_username', array(
        'label' => esc_html__('Instagram Kullanıcı Adı', 'shulebags'),
        'section' => 'shule_home_instagram',
        'type' => 'text',
    ));
    
    // Ana Sayfa Bülten Bölümü
    $wp_customize->add_section('shule_home_newsletter', array(
        'title' => esc_html__('Ana Sayfa Bülten', 'shulebags'),
        'priority' => 70,
    ));
    
    $wp_customize->add_setting('home_newsletter_title', array(
        'default' => esc_html__('E-Bültenimize Abone Olun', 'shulebags'),
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('home_newsletter_title', array(
        'label' => esc_html__('Bülten Başlık', 'shulebags'),
        'section' => 'shule_home_newsletter',
        'type' => 'text',
    ));
    
    $wp_customize->add_setting('home_newsletter_text', array(
        'default' => esc_html__('Yeni ürünler, koleksiyonlar ve özel indirimlerden haberdar olmak için e-bültenimize abone olun.', 'shulebags'),
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('home_newsletter_text', array(
        'label' => esc_html__('Bülten Metni', 'shulebags'),
        'section' => 'shule_home_newsletter',
        'type' => 'textarea',
    ));
    
    // Footer Ayarları
    $wp_customize->add_section('shule_footer', array(
        'title' => esc_html__('Footer Ayarları', 'shulebags'),
        'priority' => 80,
    ));
    
    $wp_customize->add_setting('footer_description', array(
        'default' => esc_html__('Yerel zanaatkârlar tarafından el yapımı üretilen hasır ve örgü çantalar. Doğal malzemeler, özgün tasarımlar.', 'shulebags'),
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('footer_description', array(
        'label' => esc_html__('Footer Açıklama', 'shulebags'),
        'section' => 'shule_footer',
        'type' => 'textarea',
    ));
    
    // Sosyal Medya Ayarları
    $wp_customize->add_section('shule_social', array(
        'title' => esc_html__('Sosyal Medya', 'shulebags'),
        'priority' => 90,
    ));
    
    $wp_customize->add_setting('social_instagram', array(
        'default' => 'https://instagram.com/shulebags',
        'sanitize_callback' => 'esc_url_raw',
    ));
    
    $wp_customize->add_control('social_instagram', array(
        'label' => esc_html__('Instagram URL', 'shulebags'),
        'section' => 'shule_social',
        'type' => 'url',
    ));
    
    $wp_customize->add_setting('social_facebook', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    
    $wp_customize->add_control('social_facebook', array(
        'label' => esc_html__('Facebook URL', 'shulebags'),
        'section' => 'shule_social',
        'type' => 'url',
    ));
    
    $wp_customize->add_setting('social_twitter', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    
    $wp_customize->add_control('social_twitter', array(
        'label' => esc_html__('Twitter URL', 'shulebags'),
        'section' => 'shule_social',
        'type' => 'url',
    ));
    
    // İletişim Bilgileri
    $wp_customize->add_section('shule_contact', array(
        'title' => esc_html__('İletişim Bilgileri', 'shulebags'),
        'priority' => 100,
    ));
    
    $wp_customize->add_setting('contact_email', array(
        'default' => 'info@shulebags.com',
        'sanitize_callback' => 'sanitize_email',
    ));
    
    $wp_customize->add_control('contact_email', array(
        'label' => esc_html__('E-posta Adresi', 'shulebags'),
        'section' => 'shule_contact',
        'type' => 'text',
    ));
    
    $wp_customize->add_setting('contact_phone', array(
        'default' => '+90 (212) 555 1234',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('contact_phone', array(
        'label' => esc_html__('Telefon', 'shulebags'),
        'section' => 'shule_contact',
        'type' => 'text',
    ));
}
add_action('customize_register', 'shule_customize_register');

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
 * Menü sınıfı ekleme fonksiyonu
 */
function add_additional_class_on_li($classes, $item, $args) {
    if(isset($args->add_li_class)) {
        $classes[] = $args->add_li_class;
    }
    return $classes;
}
add_filter('nav_menu_css_class', 'add_additional_class_on_li', 1, 3);

/**
 * Menü link sınıfı ekleme fonksiyonu
 */
function add_menu_link_class($atts, $item, $args) {
    if (property_exists($args, 'link_class')) {
        $atts['class'] = $args->link_class;
    }
    return $atts;
}
add_filter('nav_menu_link_attributes', 'add_menu_link_class', 1, 3);
