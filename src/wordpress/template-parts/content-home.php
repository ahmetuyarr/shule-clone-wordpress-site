
<?php
/**
 * Template part for displaying the home page content
 *
 * @package ShueBags
 */

?>

<!-- Hero Banner -->
<div class="relative h-screen bg-cover bg-center flex items-center" style="background-image: url('<?php echo esc_url(get_theme_mod('home_hero_image', get_template_directory_uri() . '/assets/images/hero.jpg')); ?>')">
    <div class="absolute inset-0 bg-black bg-opacity-20"></div>
    <div class="shule-container relative z-10">
        <div class="max-w-xl text-white">
            <h2 class="font-playfair text-4xl md:text-5xl lg:text-6xl font-medium mb-4">
                <?php echo esc_html(get_theme_mod('home_hero_title', '2024 Yaz Koleksiyonu')); ?>
            </h2>
            <p class="font-montserrat text-lg md:text-xl mb-8">
                <?php echo esc_html(get_theme_mod('home_hero_subtitle', 'Seyahatlerin ve yaz günlerinin vazgeçilmezi hasır ve örgü çantalar şimdi online mağazamızda.')); ?>
            </p>
            <a href="<?php echo esc_url(get_theme_mod('home_hero_button_link', wc_get_page_permalink('shop'))); ?>" class="inline-block bg-white hover:bg-shule-beige text-shule-darkText py-3 px-8 uppercase text-sm tracking-wider font-medium transition-all duration-300">
                <?php echo esc_html(get_theme_mod('home_hero_button_text', 'Şimdi Keşfet')); ?>
            </a>
        </div>
    </div>
</div>

<!-- Koleksiyon Bölümü -->
<section class="py-20">
    <div class="shule-container">
        <div class="text-center mb-12">
            <h2 class="shule-heading mb-3"><?php echo esc_html(get_theme_mod('home_collection_title', 'Koleksiyonlarımız')); ?></h2>
            <p class="shule-paragraph max-w-2xl mx-auto"><?php echo esc_html(get_theme_mod('home_collection_subtitle', 'Tarzınıza uygun el yapımı hasır ve örgü çantalarımızı keşfedin.')); ?></p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php
            $collections = get_terms(array(
                'taxonomy' => 'product_cat',
                'hide_empty' => false,
                'parent' => 0,
                'number' => 3
            ));

            if (!is_wp_error($collections) && !empty($collections)) :
                foreach ($collections as $collection) :
                    $thumbnail_id = get_term_meta($collection->term_id, 'thumbnail_id', true);
                    $image = $thumbnail_id ? wp_get_attachment_url($thumbnail_id) : get_template_directory_uri() . '/assets/images/placeholder.jpg';
            ?>
                <a href="<?php echo esc_url(get_term_link($collection)); ?>" class="group relative h-[500px] overflow-hidden">
                    <img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr($collection->name); ?>" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                    <div class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <h3 class="shule-subheading text-white"><?php echo esc_html($collection->name); ?></h3>
                    </div>
                </a>
            <?php
                endforeach;
            endif;
            ?>
        </div>
    </div>
</section>

<!-- Öne Çıkan Ürünler -->
<section class="py-16 bg-white">
    <div class="shule-container">
        <div class="text-center mb-12">
            <h2 class="shule-heading mb-3"><?php echo esc_html(get_theme_mod('home_featured_title', 'Öne Çıkan Ürünler')); ?></h2>
            <p class="shule-paragraph max-w-2xl mx-auto"><?php echo esc_html(get_theme_mod('home_featured_subtitle', 'El yapımı, zarif ve yaz aylarının vazgeçilmezi çantalar.')); ?></p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <?php
            $args = array(
                'post_type' => 'product',
                'posts_per_page' => 4,
                'tax_query' => array(
                    array(
                        'taxonomy' => 'product_visibility',
                        'field' => 'name',
                        'terms' => 'featured',
                        'operator' => 'IN',
                    ),
                ),
            );
            $featured_query = new WP_Query($args);
            
            if ($featured_query->have_posts()) :
                while ($featured_query->have_posts()) : $featured_query->the_post();
                    wc_get_template_part('content', 'product');
                endwhile;
                wp_reset_postdata();
            endif;
            ?>
        </div>
        
        <div class="text-center mt-12">
            <a href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>" class="shule-button inline-block">
                <?php echo esc_html(get_theme_mod('home_featured_button_text', 'Tüm Ürünleri Keşfet')); ?>
            </a>
        </div>
    </div>
</section>

<!-- Instagram Akışı -->
<section class="py-16 bg-shule-lightGrey">
    <div class="shule-container">
        <div class="text-center mb-12">
            <h2 class="shule-heading mb-3">Instagram</h2>
            <p class="shule-paragraph max-w-2xl mx-auto">
                <?php echo esc_html(get_theme_mod('home_instagram_text', 'Bizi Instagram\'da takip edin ve son koleksiyonlarımızı keşfedin.')); ?>
            </p>
            <a 
                href="<?php echo esc_url(get_theme_mod('social_instagram', 'https://instagram.com/shulebags')); ?>" 
                target="_blank" 
                rel="noopener noreferrer"
                class="inline-flex items-center space-x-2 mt-4 shule-link"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                <span>@<?php echo esc_html(get_theme_mod('instagram_username', 'shulebags')); ?></span>
            </a>
        </div>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <?php
            if (function_exists('wpiw_get_instagram')) {
                echo wpiw_get_instagram();
            } else {
                // Fallback for demonstration
                $placeholder_images = array(
                    'https://images.unsplash.com/photo-1523381294911-8d3cead13475',
                    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b',
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
                    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7',
                    'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a',
                    'https://images.unsplash.com/photo-1590739225497-56c33d413340'
                );
                
                foreach ($placeholder_images as $image) :
                ?>
                <a href="<?php echo esc_url(get_theme_mod('social_instagram', 'https://instagram.com/shulebags')); ?>" target="_blank" rel="noopener noreferrer" class="block aspect-square relative group overflow-hidden">
                    <img src="<?php echo esc_url($image); ?>" alt="Instagram post" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                    <div class="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    </div>
                </a>
                <?php
                endforeach;
            }
            ?>
        </div>
    </div>
</section>

<!-- E-Bülten Kaydı -->
<section class="py-16 bg-shule-beige">
    <div class="shule-container">
        <div class="max-w-xl mx-auto text-center">
            <h2 class="shule-heading mb-3"><?php echo esc_html(get_theme_mod('home_newsletter_title', 'E-Bültenimize Abone Olun')); ?></h2>
            <p class="shule-paragraph mb-6">
                <?php echo esc_html(get_theme_mod('home_newsletter_text', 'Yeni ürünler, koleksiyonlar ve özel indirimlerden haberdar olmak için e-bültenimize abone olun.')); ?>
            </p>
            
            <?php
            if (function_exists('mc4wp_show_form')) {
                mc4wp_show_form();
            } else {
            ?>
            <form class="flex flex-col md:flex-row gap-3">
                <input
                    type="email"
                    placeholder="<?php esc_attr_e('E-posta adresiniz', 'shulebags'); ?>"
                    class="shule-input flex-grow py-3 px-4"
                    required
                />
                <button
                    type="submit"
                    class="shule-button"
                >
                    <?php esc_html_e('Abone Ol', 'shulebags'); ?>
                </button>
            </form>
            <?php } ?>
        </div>
    </div>
</section>
