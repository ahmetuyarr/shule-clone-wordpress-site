
<?php
/**
 * Template part for displaying product archive pages
 *
 * @package ShueBags
 */
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
    
    <!-- Ürünler -->
    <div class="shule-container py-12">
        <div class="flex flex-col space-y-6 lg:space-y-0 lg:flex-row lg:space-x-8">
            <!-- Sol Filtreler -->
            <div class="lg:w-1/4">
                <div class="mb-6 lg:sticky lg:top-24">
                    <div class="flex items-center justify-between mb-4 lg:hidden">
                        <h2 class="font-medium"><?php esc_html_e('Filtreler', 'shulebags'); ?></h2>
                        <button id="filter-toggle">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down">
                                <path d="m6 9 6 6 6-6"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div id="filter-content" class="hidden lg:block space-y-6">
                        <?php 
                        // Kategori filtreleri
                        if (is_active_sidebar('shop-sidebar')) {
                            dynamic_sidebar('shop-sidebar');
                        } else {
                            // Fallback eğer sidebar tanımlı değilse
                            $product_categories = get_terms('product_cat', array(
                                'hide_empty' => true,
                                'parent' => 0
                            ));
                            
                            if (!empty($product_categories) && !is_wp_error($product_categories)) {
                                echo '<div class="mb-8">';
                                echo '<h3 class="text-lg font-playfair mb-3">' . esc_html__('Kategoriler', 'shulebags') . '</h3>';
                                echo '<ul class="space-y-2">';
                                foreach ($product_categories as $category) {
                                    echo '<li>';
                                    echo '<a href="' . esc_url(get_term_link($category)) . '" class="flex items-center shule-link">';
                                    echo esc_html($category->name);
                                    echo '<span class="ml-auto text-xs text-gray-500">(' . esc_html($category->count) . ')</span>';
                                    echo '</a>';
                                    echo '</li>';
                                }
                                echo '</ul>';
                                echo '</div>';
                            }
                        }
                        
                        // Fiyat filtresi
                        ?>
                        <div>
                            <h3 class="text-lg font-playfair mb-3"><?php esc_html_e('Fiyat Aralığı', 'shulebags'); ?></h3>
                            <div class="space-y-2">
                                <?php 
                                // WooCommerce price filter widget fallback
                                if (function_exists('woocommerce_price_filter')) {
                                    woocommerce_price_filter();
                                } else {
                                ?>
                                <div class="flex items-center space-x-4">
                                    <input type="number" placeholder="Min" class="shule-input w-1/2 py-1 px-2" />
                                    <span>-</span>
                                    <input type="number" placeholder="Max" class="shule-input w-1/2 py-1 px-2" />
                                </div>
                                <button class="w-full py-1 px-3 bg-shule-brown text-white text-sm"><?php esc_html_e('Uygula', 'shulebags'); ?></button>
                                <?php } ?>
                            </div>
                        </div>
                        
                        <?php
                        // Renk filtresi örneği
                        $colors = array('Bej', 'Beyaz', 'Kahverengi', 'Siyah', 'Turuncu', 'Yeşil');
                        ?>
                        <div>
                            <h3 class="text-lg font-playfair mb-3"><?php esc_html_e('Renkler', 'shulebags'); ?></h3>
                            <div class="flex flex-wrap gap-2">
                                <?php foreach ($colors as $color) : ?>
                                <label class="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" class="accent-shule-brown h-4 w-4" />
                                    <span><?php echo esc_html($color); ?></span>
                                </label>
                                <?php endforeach; ?>
                            </div>
                        </div>
                        
                        <?php
                        // Malzeme filtresi örneği
                        $materials = array('Hasır', 'Örgü', 'Pamuk', 'Deri', 'Keten');
                        ?>
                        <div>
                            <h3 class="text-lg font-playfair mb-3"><?php esc_html_e('Malzeme', 'shulebags'); ?></h3>
                            <div class="space-y-2">
                                <?php foreach ($materials as $material) : ?>
                                <label class="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" class="accent-shule-brown h-4 w-4" />
                                    <span><?php echo esc_html($material); ?></span>
                                </label>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Sağ Ürünler -->
            <div class="lg:w-3/4">
                <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <h1 class="shule-heading mb-3 md:mb-0">
                        <?php woocommerce_page_title(); ?>
                    </h1>
                    
                    <div class="flex items-center space-x-4">
                        <?php 
                        // Sıralama seçeneği
                        if (function_exists('woocommerce_catalog_ordering')) {
                            woocommerce_catalog_ordering();
                        } else {
                        ?>
                        <select class="shule-input py-1 px-2">
                            <option value="date"><?php esc_html_e('En Yeniler', 'shulebags'); ?></option>
                            <option value="price-asc"><?php esc_html_e('Fiyata Göre (Artan)', 'shulebags'); ?></option>
                            <option value="price-desc"><?php esc_html_e('Fiyata Göre (Azalan)', 'shulebags'); ?></option>
                            <option value="popularity"><?php esc_html_e('Popülerliğe Göre', 'shulebags'); ?></option>
                        </select>
                        <?php } ?>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <?php
                    if (have_posts()) :
                        while (have_posts()) : the_post();
                            wc_get_template_part('content', 'product');
                        endwhile;
                        
                        // Pagination
                        woocommerce_pagination();
                    else :
                        echo '<p class="text-center py-8">' . esc_html__('Ürün bulunamadı.', 'shulebags') . '</p>';
                    endif;
                    ?>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        const filterToggle = document.getElementById('filter-toggle');
        const filterContent = document.getElementById('filter-content');
        
        if (filterToggle && filterContent) {
            filterToggle.addEventListener('click', function() {
                filterContent.classList.toggle('hidden');
            });
        }
    });
</script>
