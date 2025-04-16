
<?php
/**
 * The template for displaying the footer
 *
 * @package ShueBags
 */

?>

<footer class="bg-shule-beige pt-16 pb-8">
    <div class="shule-container">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
                <h3 class="font-playfair text-xl mb-4"><?php bloginfo('name'); ?></h3>
                <p class="shule-paragraph mb-4">
                    <?php echo get_theme_mod('footer_description', 'Yerel zanaatkârlar tarafından el yapımı üretilen hasır ve örgü çantalar. Doğal malzemeler, özgün tasarımlar.'); ?>
                </p>
                <div class="flex space-x-4">
                    <?php if (get_theme_mod('social_instagram')): ?>
                    <a href="<?php echo esc_url(get_theme_mod('social_instagram')); ?>" target="_blank" rel="noopener noreferrer" class="shule-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    </a>
                    <?php endif; ?>
                    
                    <?php if (get_theme_mod('social_facebook')): ?>
                    <a href="<?php echo esc_url(get_theme_mod('social_facebook')); ?>" target="_blank" rel="noopener noreferrer" class="shule-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    </a>
                    <?php endif; ?>
                    
                    <?php if (get_theme_mod('social_twitter')): ?>
                    <a href="<?php echo esc_url(get_theme_mod('social_twitter')); ?>" target="_blank" rel="noopener noreferrer" class="shule-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                    </a>
                    <?php endif; ?>
                </div>
            </div>
            
            <?php if (is_active_sidebar('footer-1')): ?>
                <div>
                    <?php dynamic_sidebar('footer-1'); ?>
                </div>
            <?php else: ?>
                <div>
                    <h3 class="uppercase font-montserrat text-sm font-semibold mb-4"><?php esc_html_e('Alışveriş', 'shulebags'); ?></h3>
                    <ul class="space-y-2">
                        <li>
                            <a href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>" class="shule-link text-sm">
                                <?php esc_html_e('Tüm Ürünler', 'shulebags'); ?>
                            </a>
                        </li>
                        <li>
                            <a href="<?php echo esc_url(get_term_link('summer', 'product_cat')); ?>" class="shule-link text-sm">
                                <?php esc_html_e('Yaz Koleksiyonu', 'shulebags'); ?>
                            </a>
                        </li>
                        <li>
                            <a href="<?php echo esc_url(get_term_link('bestsellers', 'product_cat')); ?>" class="shule-link text-sm">
                                <?php esc_html_e('En Çok Satanlar', 'shulebags'); ?>
                            </a>
                        </li>
                        <li>
                            <a href="<?php echo esc_url(get_term_link('new', 'product_cat')); ?>" class="shule-link text-sm">
                                <?php esc_html_e('Yeni Gelenler', 'shulebags'); ?>
                            </a>
                        </li>
                    </ul>
                </div>
            <?php endif; ?>
            
            <?php if (is_active_sidebar('footer-2')): ?>
                <div>
                    <?php dynamic_sidebar('footer-2'); ?>
                </div>
            <?php else: ?>
                <div>
                    <h3 class="uppercase font-montserrat text-sm font-semibold mb-4"><?php esc_html_e('Yardım', 'shulebags'); ?></h3>
                    <ul class="space-y-2">
                        <li>
                            <a href="<?php echo esc_url(home_url('/shipping/')); ?>" class="shule-link text-sm">
                                <?php esc_html_e('Kargo ve Teslimat', 'shulebags'); ?>
                            </a>
                        </li>
                        <li>
                            <a href="<?php echo esc_url(home_url('/returns/')); ?>" class="shule-link text-sm">
                                <?php esc_html_e('İade ve Değişim', 'shulebags'); ?>
                            </a>
                        </li>
                        <li>
                            <a href="<?php echo esc_url(home_url('/sizing/')); ?>" class="shule-link text-sm">
                                <?php esc_html_e('Boyut Rehberi', 'shulebags'); ?>
                            </a>
                        </li>
                        <li>
                            <a href="<?php echo esc_url(home_url('/faq/')); ?>" class="shule-link text-sm">
                                <?php esc_html_e('Sıkça Sorulan Sorular', 'shulebags'); ?>
                            </a>
                        </li>
                    </ul>
                </div>
            <?php endif; ?>
            
            <div>
                <h3 class="uppercase font-montserrat text-sm font-semibold mb-4"><?php esc_html_e('İletişim', 'shulebags'); ?></h3>
                <p class="text-sm mb-2"><?php echo get_theme_mod('contact_email', 'info@shulebags.com'); ?></p>
                <p class="text-sm mb-4"><?php echo get_theme_mod('contact_phone', '+90 (212) 555 1234'); ?></p>
                <h4 class="uppercase font-montserrat text-sm font-semibold mb-2"><?php esc_html_e('Bülten', 'shulebags'); ?></h4>
                <p class="text-sm mb-2"><?php esc_html_e('Yeni ürünler ve kampanyalar için kaydolun.', 'shulebags'); ?></p>
                
                <?php 
                if (function_exists('mc4wp_show_form')) {
                    mc4wp_show_form();
                } else {
                ?>
                <form class="flex mt-2" action="<?php echo esc_url(home_url('/')); ?>" method="post">
                    <input 
                        type="email" 
                        name="newsletter_email"
                        placeholder="<?php esc_attr_e('E-posta adresiniz', 'shulebags'); ?>" 
                        class="shule-input text-sm py-2 px-3"
                        required
                    />
                    <button 
                        type="submit" 
                        class="bg-shule-brown hover:bg-shule-darkBrown text-white py-2 px-4 text-sm uppercase tracking-wider"
                    >
                        <?php esc_html_e('Gönder', 'shulebags'); ?>
                    </button>
                </form>
                <?php } ?>
            </div>
        </div>
        
        <div class="border-t border-shule-grey pt-6 flex flex-col md:flex-row justify-between items-center">
            <p class="text-xs text-shule-darkText/70 mb-4 md:mb-0">
                © <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. <?php esc_html_e('Tüm hakları saklıdır.', 'shulebags'); ?>
            </p>
            <div class="flex space-x-4">
                <a href="<?php echo esc_url(get_privacy_policy_url()); ?>" class="text-xs shule-link">
                    <?php esc_html_e('Gizlilik Politikası', 'shulebags'); ?>
                </a>
                <a href="<?php echo esc_url(home_url('/terms/')); ?>" class="text-xs shule-link">
                    <?php esc_html_e('Kullanım Koşulları', 'shulebags'); ?>
                </a>
            </div>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>

<script>
    // Menü toggle script
    document.addEventListener('DOMContentLoaded', function() {
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

</body>
</html>
