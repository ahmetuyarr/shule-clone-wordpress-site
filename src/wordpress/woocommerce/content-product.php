
<?php
/**
 * The template for displaying product content within loops
 *
 * @package ShueBags
 */

defined('ABSPATH') || exit;

global $product;

// Ensure visibility.
if (empty($product) || !$product->is_visible()) {
    return;
}
?>
<div class="shule-card group">
    <div class="relative overflow-hidden">
        <a href="<?php echo esc_url(get_permalink()); ?>">
            <?php echo woocommerce_get_product_thumbnail('woocommerce_thumbnail', array('class' => 'shule-product-image aspect-[3/4] object-cover w-full')); ?>
        </a>
        
        <!-- Product badges -->
        <?php if ($product->is_on_sale()) : ?>
            <div class="absolute top-2 left-2 bg-black text-white text-xs uppercase tracking-wider py-1 px-2">
                <?php esc_html_e('İndirim', 'shulebags'); ?>
            </div>
        <?php endif; ?>
        
        <?php if ($product->is_featured()) : ?>
            <div class="absolute top-2 right-2 bg-shule-brown text-white text-xs uppercase tracking-wider py-1 px-2">
                <?php esc_html_e('Çok Satan', 'shulebags'); ?>
            </div>
        <?php endif; ?>
        
        <?php 
        // Yeni ürün etiketi (30 günden yeni ürünler)
        $post_date = get_the_time('Y-m-d');
        $days_ago = (time() - strtotime($post_date)) / (60 * 60 * 24);
        
        if ($days_ago < 30) : ?>
            <div class="absolute top-2 <?php echo $product->is_on_sale() ? 'left-20' : 'left-2'; ?> bg-black text-white text-xs uppercase tracking-wider py-1 px-2">
                <?php esc_html_e('Yeni', 'shulebags'); ?>
            </div>
        <?php endif; ?>
        
        <!-- Quick action buttons -->
        <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <?php woocommerce_template_loop_add_to_cart(array('class' => 'bg-white hover:bg-shule-beige p-3 rounded-full shadow-md transition-colors duration-300')); ?>
            
            <?php if (function_exists('YITH_WCWL')) : ?>
                <div class="bg-white hover:bg-shule-beige p-3 rounded-full shadow-md transition-colors duration-300">
                    <?php echo do_shortcode('[yith_wcwl_add_to_wishlist]'); ?>
                </div>
            <?php else : ?>
                <button class="bg-white hover:bg-shule-beige p-3 rounded-full shadow-md transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    </svg>
                </button>
            <?php endif; ?>
        </div>
    </div>
    
    <div class="p-4">
        <?php
        // Ürün kategorisi
        $categories = wc_get_product_category_list($product->get_id(), ', ');
        if ($categories) {
            echo '<p class="text-sm text-shule-darkText/70 mb-1">' . wp_kses_post($categories) . '</p>';
        }
        ?>
        <a href="<?php echo esc_url(get_permalink()); ?>" class="block mb-1 hover:text-shule-brown transition-colors">
            <h3 class="font-medium"><?php echo esc_html($product->get_name()); ?></h3>
        </a>
        <p class="font-medium"><?php echo $product->get_price_html(); ?></p>
    </div>
</div>
