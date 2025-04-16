
<?php
/**
 * Template part for displaying page content
 *
 * @package ShueBags
 */
?>

<div class="pt-24 pb-16">
    <!-- Breadcrumb -->
    <div class="bg-shule-lightGrey py-3">
        <div class="shule-container">
            <nav class="flex items-center flex-wrap">
                <a href="<?php echo esc_url(home_url('/')); ?>" class="shule-link">
                    <?php esc_html_e('Ana Sayfa', 'shulebags'); ?>
                </a>
                <span class="mx-1">/</span>
                <span><?php the_title(); ?></span>
            </nav>
        </div>
    </div>
    
    <div class="shule-container py-12">
        <h1 class="shule-heading mb-8"><?php the_title(); ?></h1>
        
        <div class="shule-paragraph">
            <?php the_content(); ?>
            
            <?php
            // Sayfa içerisindeki formları göster
            wp_link_pages(
                array(
                    'before' => '<div class="page-links">' . esc_html__('Sayfalar:', 'shulebags'),
                    'after'  => '</div>',
                )
            );
            ?>
        </div>
    </div>
</div>
