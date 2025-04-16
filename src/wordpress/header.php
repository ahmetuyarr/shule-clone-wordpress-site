
<?php
/**
 * Header template
 *
 * @package ShueBags
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?php bloginfo('description'); ?>">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header id="site-header" class="fixed top-0 left-0 w-full z-50 transition-all duration-300 <?php echo is_front_page() && !is_scrolled() ? 'bg-transparent py-4' : 'bg-white shadow-sm py-2'; ?>">
    <div class="shule-container flex items-center justify-between">
        <div class="lg:hidden">
            <button id="menu-toggle" class="p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
        </div>
        
        <div class="flex-1 lg:flex-none">
            <a href="<?php echo esc_url(home_url('/')); ?>" class="block">
                <?php if (has_custom_logo()): ?>
                    <?php the_custom_logo(); ?>
                <?php else: ?>
                    <h1 class="font-playfair text-2xl md:text-3xl font-bold"><?php bloginfo('name'); ?></h1>
                <?php endif; ?>
            </a>
        </div>
        
        <nav id="primary-menu" class="fixed lg:relative top-0 left-0 h-full w-full lg:w-auto lg:h-auto bg-white lg:bg-transparent transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out lg:flex lg:items-center z-40">
            <div class="p-6 lg:hidden flex justify-between items-center border-b border-shule-grey">
                <h2 class="font-playfair text-xl"><?php esc_html_e('Menu', 'shulebags'); ?></h2>
                <button id="menu-close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>
            <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'container'      => false,
                    'menu_class'     => 'flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6 p-6 lg:p-0',
                    'fallback_cb'    => false,
                    'add_li_class'   => '',
                    'link_class'     => 'uppercase text-sm font-medium tracking-wide shule-link',
                ));
            ?>
        </nav>
        
        <div class="flex items-center space-x-4">
            <a href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>" class="p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </a>
            <a href="<?php echo esc_url(wc_get_page_permalink('myaccount')); ?>" class="p-1 hidden md:block">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </a>
            <a href="<?php echo esc_url(wc_get_page_permalink('myaccount')) . '/wishlist'; ?>" class="p-1 hidden md:block">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </a>
            <a href="<?php echo esc_url(wc_get_page_permalink('cart')); ?>" class="p-1 relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-bag"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <?php $cart_count = WC()->cart ? WC()->cart->get_cart_contents_count() : 0; ?>
                <?php if ($cart_count > 0): ?>
                <span class="absolute -top-1 -right-1 bg-shule-brown text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    <?php echo esc_html($cart_count); ?>
                </span>
                <?php endif; ?>
            </a>
        </div>
    </div>
    
    <div id="menu-overlay" class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden hidden"></div>
</header>

<script>
    // Sayfa yüklendiğinde çalışacak script
    document.addEventListener('DOMContentLoaded', function() {
        // Header elementi
        const header = document.getElementById('site-header');
        
        // Scroll olayını dinle
        window.addEventListener('scroll', function() {
            // Scroll pozisyonu 50px'den fazla ise
            if (window.scrollY > 50) {
                header.classList.remove('bg-transparent');
                header.classList.add('bg-white', 'shadow-sm', 'py-2');
                // Cookie'yi set et
                document.cookie = "scrolled=true; path=/";
            } else if (<?php echo is_front_page() ? 'true' : 'false'; ?>) {
                // Ana sayfada ise ve scroll pozisyonu 50px'den az ise
                header.classList.add('bg-transparent', 'py-4');
                header.classList.remove('bg-white', 'shadow-sm', 'py-2');
                // Cookie'yi sıfırla
                document.cookie = "scrolled=false; path=/";
            }
        });
        
        // Menü toggle script
        const menuToggle = document.getElementById('menu-toggle');
        const menuClose = document.getElementById('menu-close');
        const primaryMenu = document.getElementById('primary-menu');
        const menuOverlay = document.getElementById('menu-overlay');
        
        if (menuToggle && primaryMenu && menuOverlay) {
            menuToggle.addEventListener('click', function() {
                primaryMenu.classList.remove('-translate-x-full');
                menuOverlay.classList.remove('hidden');
            });
        }
        
        if (menuClose && primaryMenu && menuOverlay) {
            menuClose.addEventListener('click', function() {
                primaryMenu.classList.add('-translate-x-full');
                menuOverlay.classList.add('hidden');
            });
        }
        
        if (menuOverlay) {
            menuOverlay.addEventListener('click', function() {
                primaryMenu.classList.add('-translate-x-full');
                menuOverlay.classList.add('hidden');
            });
        }
    });
</script>
