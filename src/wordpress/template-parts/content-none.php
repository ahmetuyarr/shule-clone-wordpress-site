
<?php
/**
 * Template part for displaying a message that posts cannot be found
 *
 * @package ShueBags
 */
?>

<div class="pt-24 pb-16">
    <div class="shule-container">
        <div class="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-x mx-auto mb-4 text-gray-400">
                <path d="m13.5 8.5-5 5"/>
                <path d="m8.5 8.5 5 5"/>
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
            </svg>
            
            <header class="mb-6">
                <h1 class="shule-heading">
                    <?php esc_html_e('İçerik Bulunamadı', 'shulebags'); ?>
                </h1>
            </header>

            <div class="shule-paragraph max-w-2xl mx-auto mb-8">
                <?php
                if (is_search()) :
                    ?>
                    <p><?php esc_html_e('Aramanızla eşleşen sonuç bulunamadı. Lütfen farklı anahtar kelimelerle tekrar deneyin.', 'shulebags'); ?></p>
                    <?php
                    get_search_form();
                else :
                    ?>
                    <p><?php esc_html_e('Aradığınız sayfa bulunamadı. Belki aşağıdaki bağlantılardan birini denemek istersiniz?', 'shulebags'); ?></p>
                    
                    <div class="mt-8 flex flex-col items-center space-y-4">
                        <a href="<?php echo esc_url(home_url('/')); ?>" class="shule-button">
                            <?php esc_html_e('Ana Sayfaya Dön', 'shulebags'); ?>
                        </a>
                        
                        <a href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>" class="shule-link">
                            <?php esc_html_e('Mağazamızı Keşfedin', 'shulebags'); ?>
                        </a>
                    </div>
                <?php
                endif;
                ?>
            </div>
        </div>
    </div>
</div>
