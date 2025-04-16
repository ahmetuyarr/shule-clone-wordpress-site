
<?php
/**
 * Template part for displaying a single product
 *
 * @package ShueBags
 */

// WooCommerce ürün detaylarını al
global $product;

// Eğer ürün tanımlı değilse çık
if (!is_object($product)) {
    return;
}

// Gerekli verileri al
$gallery_images = $product->get_gallery_image_ids();
$rating_count = $product->get_rating_count();
$average_rating = $product->get_average_rating();
$product_attributes = $product->get_attributes();
$stock_quantity = $product->get_stock_quantity();
?>

<div class="pt-24">
    <!-- Breadcrumb -->
    <div class="bg-shule-lightGrey py-3">
        <div class="shule-container">
            <?php woocommerce_breadcrumb(array(
                'wrap_before' => '<nav class="woocommerce-breadcrumb flex items-center flex-wrap" itemprop="breadcrumb">',
                'wrap_after' => '</nav>',
                'delimiter' => '<span class="mx-1">/</span>',
            )); ?>
        </div>
    </div>
    
    <!-- Ürün Detayı -->
    <section class="py-12">
        <div class="shule-container">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <!-- Ürün Görselleri -->
                <div>
                    <div class="product-gallery">
                        <?php 
                        // Ana ürün görseli
                        if (has_post_thumbnail()) {
                            echo '<div class="mb-4 aspect-square overflow-hidden">';
                            echo woocommerce_get_product_thumbnail('full');
                            echo '</div>';
                        }
                        
                        // Galeri görselleri
                        if (!empty($gallery_images)) {
                            echo '<div class="grid grid-cols-4 gap-4">';
                            foreach ($gallery_images as $image_id) {
                                echo '<div class="aspect-square cursor-pointer border-2 border-transparent hover:border-shule-brown">';
                                echo wp_get_attachment_image($image_id, 'thumbnail', false, array('class' => 'w-full h-full object-cover'));
                                echo '</div>';
                            }
                            echo '</div>';
                        }
                        ?>
                    </div>
                </div>
                
                <!-- Ürün Bilgileri -->
                <div>
                    <h1 class="shule-heading mb-2"><?php the_title(); ?></h1>
                    
                    <?php if ($rating_count > 0) : ?>
                    <div class="flex items-center space-x-4 mb-4">
                        <div class="flex">
                            <?php for ($i = 1; $i <= 5; $i++) : ?>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="<?php echo ($i <= floor($average_rating)) ? '#FBBF24' : 'none'; ?>" stroke="<?php echo ($i <= floor($average_rating)) ? '#FBBF24' : '#D1D5DB'; ?>" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                </svg>
                            <?php endfor; ?>
                        </div>
                        <span class="text-sm"><?php echo esc_html($average_rating); ?>/5 (<?php echo esc_html($rating_count); ?> <?php esc_html_e('yorum', 'shulebags'); ?>)</span>
                    </div>
                    <?php endif; ?>
                    
                    <div class="text-2xl font-medium mb-6"><?php woocommerce_template_single_price(); ?></div>
                    
                    <div class="shule-paragraph mb-6"><?php the_excerpt(); ?></div>
                    
                    <?php if (!empty($product_attributes)) : ?>
                    <div class="mb-8">
                        <div class="font-medium mb-2"><?php esc_html_e('Özellikler:', 'shulebags'); ?></div>
                        <ul class="list-disc pl-5 space-y-1">
                            <?php foreach ($product_attributes as $attribute) : 
                                if ($attribute->get_visible()) :
                                    $values = wc_get_product_terms($product->get_id(), $attribute->get_name(), array('fields' => 'names'));
                                    if (!empty($values)) :
                                        foreach ($values as $value) : ?>
                                            <li class="text-sm"><?php echo esc_html($value); ?></li>
                                        <?php endforeach;
                                    endif;
                                endif;
                            endforeach; ?>
                        </ul>
                    </div>
                    <?php endif; ?>
                    
                    <?php 
                    // Değişken ürün seçenekleri (renk, boyut gibi)
                    woocommerce_template_single_add_to_cart();
                    ?>
                    
                    <?php
                    // Stok durumu
                    if ($product->is_in_stock()) : ?>
                        <div class="text-sm text-green-600 mb-4">
                            <?php
                            if ($stock_quantity) {
                                /* translators: %s: Stock quantity */
                                echo sprintf(esc_html__('%s adet stokta', 'shulebags'), $stock_quantity);
                            } else {
                                esc_html_e('Stokta var', 'shulebags');
                            }
                            ?>
                        </div>
                    <?php else : ?>
                        <div class="text-sm text-red-600 mb-4"><?php esc_html_e('Stokta yok', 'shulebags'); ?></div>
                    <?php endif; ?>
                    
                    <div class="space-y-4 mt-8">
                        <div class="flex items-start space-x-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-truck mt-0.5">
                                <path d="M10 17h4V5H2v12h3"/>
                                <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/>
                                <path d="M14 17a2 2 0 1 1-4 0"/>
                                <path d="M20 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
                            </svg>
                            <div>
                                <h4 class="text-sm font-medium"><?php esc_html_e('Ücretsiz Kargo', 'shulebags'); ?></h4>
                                <p class="text-xs text-gray-500"><?php esc_html_e('1000 TL üzeri alışverişlerde ücretsiz kargo', 'shulebags'); ?></p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check mt-0.5">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                                <path d="m9 12 2 2 4-4"/>
                            </svg>
                            <div>
                                <h4 class="text-sm font-medium"><?php esc_html_e('30 Gün İade Garantisi', 'shulebags'); ?></h4>
                                <p class="text-xs text-gray-500"><?php esc_html_e('Sorunsuz iade ve değişim imkanı', 'shulebags'); ?></p>
                            </div>
                        </div>
                    </div>

                    <?php
                    // Ürün meta (kategoriler, etiketler, vb.)
                    woocommerce_template_single_meta();
                    ?>

                    <?php
                    // Sosyal paylaşım butonları
                    if (function_exists('woocommerce_social_share_buttons')) {
                        woocommerce_social_share_buttons();
                    }
                    ?>
                </div>
            </div>
            
            <!-- Ürün Detay Sekmeleri -->
            <div class="mt-16">
                <?php woocommerce_output_product_data_tabs(); ?>
            </div>
        </div>
    </section>
    
    <!-- İlgili Ürünler -->
    <section class="py-16 bg-white">
        <div class="shule-container">
            <div class="text-center mb-12">
                <h2 class="shule-heading mb-3"><?php esc_html_e('Benzer Ürünler', 'shulebags'); ?></h2>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <?php
                woocommerce_related_products(array(
                    'posts_per_page' => 4,
                    'columns' => 4,
                    'orderby' => 'rand'
                ));
                ?>
            </div>
            
            <div class="text-center mt-12">
                <a href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>" class="shule-button inline-block">
                    <?php esc_html_e('Tüm Ürünleri Keşfet', 'shulebags'); ?>
                </a>
            </div>
        </div>
    </section>
</div>
